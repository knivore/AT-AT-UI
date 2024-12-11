import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

import {Download, Loader, ThumbsDown, ThumbsUp} from 'lucide-react';
import {TableCell, TableRow} from '@/components/ui/table';
import {TestExecution} from '@/library/types';
import React, {useState} from 'react';

export function Execution({execution}: { execution: TestExecution }) {
    // Local state for rating
    const [rating, setRating] = useState(execution.rating);
    const start_time = execution.start_time ? new Date(execution.start_time).toLocaleString('en-SG', {timeZone: 'Asia/Singapore'}) : null;
    const end_time = execution.end_time ? new Date(execution.end_time).toLocaleString('en-SG', {timeZone: 'Asia/Singapore'}) : null;

    const [loading, setLoading] = useState(false);
    const handleDownload = async () => {
        if (execution.status_outcome !== 'completed') {
            alert('Test is not completed yet!');
            return;
        }

        setLoading(true);  // Show loading indicator

        try {
            // Make a request to FastAPI to get the test results (e.g., the .xlsx file)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/getTestResult/${execution.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                mode: "cors",
            });

            if (!response.ok) {
                throw new Error('Failed to fetch the test result');
            }

            // Extract the file name and content disposition from the response headers
            const contentDisposition = response.headers.get('Content-Disposition');
            const fileName = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : execution.id + '.xlsx';
            const blob = await response.blob();

            // Create a link to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            // Clean up the URL object
            URL.revokeObjectURL(link.href);
        } catch (error) {
            alert('Error downloading file: ' + error.message);
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    function rateTestResult(execution: TestExecution, rating: string) {
        if (execution.status_outcome !== 'completed') {
            alert('Test is not completed yet!');
            return;
        }

        setRating(rating); // Update the local state immediately for real-time UI update

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/rate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                test_id: execution.id,
                rating: rating.toString()
            }),
            credentials: 'include',
            mode: "cors",
        }).then(r => r.json()).catch((error) => {
            console.error("Error updating rating:", error);
        });
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{execution.id}</TableCell>
            <TableCell className="text-center">
                <Badge
                    variant={execution.status_outcome === 'successful' ? 'successful' : 'failed'}
                    className="capitalize mx-auto"
                >
                    {execution.status_outcome}
                </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
                {start_time}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
                {end_time}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">{execution.run_time}</TableCell>
            <TableCell className="text-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                aria-label="Download results"
                                variant="ghost"
                                onClick={execution.status_outcome !== 'completed' || loading ? undefined : handleDownload}
                                className={`${execution.status_outcome !== 'completed' ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader className="h-4 w-4"/> : <Download className="h-4 w-4"/>}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download results</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TableCell>
            <TableCell className="text-center">
                <TooltipProvider>
                    <div className="flex space-x-2 justify-center">
                        {/* Positive rating button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    aria-label="Rate positively"
                                    variant="ghost"
                                    onClick={() => execution.status_outcome !== 'completed' ? {} : rateTestResult(execution, 'positive')}
                                    className={`flex items-center justify-center w-8 h-8 p-1 rounded border border-transparent hover:border-muted hover:bg-muted/20 ${execution.status_outcome !== 'completed' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                >
                                    <ThumbsUp
                                        className={`h-4 w-4 ${
                                            rating === 'positive' ? "text-green-500" : ""
                                        }`}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rate Positively</p>
                            </TooltipContent>
                        </Tooltip>

                        {/* Negative rating button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    aria-label="Rate negatively"
                                    variant="ghost"
                                    onClick={() => execution.status_outcome !== 'completed' ? {} : rateTestResult(execution, 'negative')}
                                    className={`flex items-center justify-center w-8 h-8 p-1 rounded border border-transparent hover:border-muted hover:bg-muted/20 ${execution.status_outcome !== 'completed' ? 'opacity-20 cursor-not-allowed' : ''}`}
                                >
                                    <ThumbsDown
                                        className={`h-4 w-4 ${
                                            rating === 'negative' ? "text-red-500" : ""
                                        }`}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Rate Negatively</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </TableCell>
        </TableRow>
    );
}

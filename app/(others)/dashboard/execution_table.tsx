'use client';

import {Table, TableBody, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Execution} from './execution';
import {TestExecution} from '@/library/types';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {Button} from '@/components/ui/button';

export function TestExecutionTable({
                                       testExecution, offset, limit, totalTestExecutions, search,
                                       nextPage,
                                       prevPage
                                   }: {
    testExecution: TestExecution[];
    offset: number;
    limit: number;
    totalTestExecutions: number;
    search: String,
    nextPage: any,
    prevPage: any
}) {
    let runsPerPage = limit;
    const startIndex = totalTestExecutions > 0 ? Math.max(offset + 1, 1) : 0;
    const endIndex = Math.min(totalTestExecutions, offset + runsPerPage)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Testcase Executions</CardTitle>
                <CardDescription>
                    View your testcase executions and download results.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test ID</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Created at</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Ended at</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Total Runtime</TableHead>
                            <TableHead className="text-center">Download Results</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testExecution.map((execution: TestExecution) => (
                            <Execution key={execution.id} execution={execution}/>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="flex items-center w-full justify-between">
                    <div className="text-xs text-muted-foreground">
                        Showing{' '}
                        <strong>
                            {startIndex} - {endIndex}
                        </strong>{' '}
                        of <strong>{totalTestExecutions}</strong> executions
                    </div>
                    <div className="flex">
                        <Button
                            onClick={prevPage}
                            variant="ghost"
                            size="sm"
                            disabled={startIndex <= runsPerPage}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4"/>
                            Prev
                        </Button>
                        <Button
                            onClick={nextPage}
                            variant="ghost"
                            size="sm"
                            disabled={endIndex == totalTestExecutions}
                        >
                            Next
                            <ChevronRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

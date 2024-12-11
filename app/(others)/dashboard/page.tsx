'use client';

import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {PlusCircle} from 'lucide-react';
import {TestExecutionTable} from './execution_table';
import {useSession} from "next-auth/react";
import {useEffect, useState} from 'react';
import {Spinner} from "@/components/ui/icons";
import Link from "next/link";

export default function DashboardPage() {
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState('');
    const limit: number = 8;

    const {data: session, status} = useSession();
    const [testExecution, setTestExecution] = useState([]);
    const [totalExecutions, setTotalExecutions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Explicitly typing error as string or null

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/getTestExecutions${search ? `?search=${search}&offset=${offset}` : `?offset=${offset}`}${limit ? `&limit=${limit}` : ``}`)
            .then((res) => res.json())
            .then((data) => {
                setTestExecution(data.executions);
                setTotalExecutions(data.totalExecutionRuns);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [search, offset]);


    if (loading || status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>{error}</p>
            </div>
        );
    }

    function nextPage() {
        setOffset((prevOffset) => prevOffset + limit);
    }

    function prevPage() {
        setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
    }

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    {/*<TabsTrigger value="success">Successful</TabsTrigger>*/}
                    {/*<TabsTrigger value="failed">Failed</TabsTrigger>*/}
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    {/*<Button size="sm" variant="outline" className="h-8 gap-1">*/}
                    {/*    <File className="h-3.5 w-3.5"/>*/}
                    {/*    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">*/}
                    {/*      Export*/}
                    {/*    </span>*/}
                    {/*</Button>*/}
                    <Link href="/test_execution"
                          className="h-8 flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                        <PlusCircle className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap font-normal">
                          New
                        </span>
                    </Link>
                </div>
            </div>
            <TabsContent value="all">
                <TestExecutionTable
                    testExecution={testExecution}
                    offset={offset}
                    limit={limit}
                    totalTestExecutions={totalExecutions}
                    search={search}
                    nextPage={nextPage}
                    prevPage={prevPage}
                />
            </TabsContent>
        </Tabs>
    );
}

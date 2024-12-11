"use client"

import {useEffect, useRef, useState} from "react";
import AutomationFramework from "@/components/SpecialKeySequence/AutomationFramework";
import HeadlessMode from "@/components/SpecialKeySequence/HeadlessMode";
import {CircleStop, Download, Play} from "lucide-react";
import {useSession} from "next-auth/react";
import ConcurrentTestCount from "@/components/SpecialKeySequence/ConcurrentTestCount";

const LogWindow = ({isActive, setTestState, uploadedFile, setUploadedFile, execution}) => {
    const [loading, setLoading] = useState(false);
    const [dotCount, setDotCount] = useState(0); // For animated dots
    const [loggedOutput, setLoggedOutput] = useState("");
    const [downloadResult, setDownloadResult] = useState(false);
    const [saveAllScreenshots, setSaveAllScreenshots] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState('');
    const [concurrentTestCount, setConcurrentTestCount] = useState(15);
    const [headlessMode, setHeadlessMode] = useState(false);
    const textareaRef = useRef(null);
    const {data: session, update} = useSession();

    // Handle dot animation when loading is true
    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setDotCount((prev) => (prev < 5 ? prev + 1 : 1));
            }, 500);
        } else {
            setDotCount(0); // Reset dots when loading stops
        }

        return () => clearInterval(interval); // Cleanup on unmount
    }, [loading]);

    // Automatically scroll down when text changes
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [loggedOutput]);

    const handleTestRun = async () => {
        setLoading(true);

        if (!isActive) {
            setLoggedOutput("");
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/start-test`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    saveAllScreenshots: saveAllScreenshots,
                    selectedAutomationFramework: selectedFramework,
                    headlessMode: headlessMode,
                    concurrentTestCount: concurrentTestCount,
                    ...execution
                }),
                credentials: "include",
                mode: "cors",
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setTestState(!isActive);

                readStream();
            });
        } else {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/stop-test`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...execution
                }),
                credentials: "include",
                mode: "cors",
            }).then(response => {
                // Do nothing
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                setTestState(!isActive);
            });
        }
    };

    async function readStream() {
        // If there's test_id and data_directory, then proceed
        if (!execution?.test_id || !execution?.data_directory) {
            return;
        }

        const queryParams = new URLSearchParams({
            test_id: execution.test_id,
            data_directory: execution.data_directory
        }).toString();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/stream-logs?${queryParams}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                keepalive: true,
                mode: "cors",
            })

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {done, value} = await reader.read();
                if (done) {
                    break;
                }

                const lines = decoder.decode(value).split("\n");
                lines.forEach(line => {
                    if (line.trim().includes("Test execution run completed")) {
                        handleFileDownload();
                        setUploadedFile(null);
                        setDownloadResult(true);
                    }
                    setLoggedOutput(prevLoggedOutput => prevLoggedOutput + line + "\n");
                });
            }
        } catch (err) {
            console.error("Stream read error:", err);
        }

        setTestState(false);
        setLoading(false);
    }

    const handleFileDownload = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/results`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...execution
            }),
            credentials: "include",
            mode: "cors",
        })
            .then(res => {
                return res.blob().then(blob => {
                    const fileUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = fileUrl;
                    a.download = `${execution.test_id}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                });
            }).then(() => {
            setLoggedOutput((prevLoggedOutput) => {
                return prevLoggedOutput + "\n" + "Test results downloaded successfully.";
            });
        });
    };

    const handleTemplateDownload = () => {
        const link = document.createElement('a');
        link.href = '/template.xlsx';
        link.download = 'template.xlsx';
        link.click();
    };

    const showLogWindowState = () => {
        if (loggedOutput !== "") {
            return loggedOutput;
        } else if (loading) {
            return `Planning the crew execution. This will take some time. Please hold on${'.'.repeat(dotCount)}`;
        } else {
            return ""
        }
    }

    return (
        <div className="w-full flex flex-col space-y-4">
            <div className="w-full">
                <div className="pb-2 text-sm md:text-base">Log Output:</div>
                <textarea
                    name="log-output"
                    ref={textareaRef}
                    className="w-full bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded p-4 min-h-[400px] max-h-[90vh] font-mono resize-none overflow-auto"
                    value={showLogWindowState()} disabled
                />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white flex items-center rounded px-4 py-2 ${!uploadedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleTestRun} disabled={!uploadedFile}>
                    {isActive ? <CircleStop className="w-4 h-4 mr-2"/> : <Play className="w-4 h-4 mr-2"/>}
                    {isActive ? "Stop" : "Start"} Test Run
                </button>
                <button
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white flex items-center rounded px-4 py-2 ${
                        isActive || loggedOutput === "" ? "opacity-50 cursor-not-allowed" : ""
                    }`} onClick={handleFileDownload} disabled={!downloadResult}>
                    <Download className="w-4 h-4 mr-2"/>
                    Download Test Results
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white flex items-center rounded px-4 py-2"
                        onClick={handleTemplateDownload}>
                    <Download className="w-4 h-4 mr-2"/>
                    Download Template
                </button>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <input
                    type="checkbox"
                    id="saveAllScreenshots"
                    checked={saveAllScreenshots}
                    className="cursor-pointer"
                    onChange={(e) => setSaveAllScreenshots(e.target.checked)}
                />
                <label htmlFor="saveAllScreenshots" className="text-gray-800 dark:text-gray-300 cursor-pointer">
                    Save All Screenshots
                </label>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <AutomationFramework selectedFramework={selectedFramework}
                                     setSelectedFramework={setSelectedFramework}/>
                <HeadlessMode headlessMode={headlessMode} setHeadlessMode={setHeadlessMode}/>
                <ConcurrentTestCount concurrentTestCount={concurrentTestCount}
                                     setConcurrentTestCount={setConcurrentTestCount}/>
            </div>
        </div>
    );
};

export default LogWindow;

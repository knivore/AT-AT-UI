"use client"

import {useState} from "react";
import HumanInput from "@/app/(others)/test_execution/human_input";
import FileUpload from "@/app/(others)/test_execution/file_upload";
import LogWindow from "@/app/(others)/test_execution/log_window";

export default function TestExecutionPage() {
    const [isActive, setIsActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [execution, setExecution] = useState(null);

    const setTestState = (isRunning) => {
        setIsActive(isRunning);
    };

    return (
        <div className="min-h-[500px] flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-1/3 flex flex-col p-4">
                <div>
                    <FileUpload isActive={isActive} uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} setExecution={setExecution}/>
                </div>

                <div className="mt-12">
                    <HumanInput/>
                </div>
            </div>

            <div className="w-full lg:w-2/3 p-4">
                <LogWindow isActive={isActive} setTestState={setTestState} uploadedFile={uploadedFile}
                           setUploadedFile={setUploadedFile} execution={execution}/>
            </div>
        </div>
    );
}

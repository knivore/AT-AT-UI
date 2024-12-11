"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"


export default function PenTestPage() {

    return (
        <div className="flex flex-col w-full space-y-4 p-4 bg-gray-50 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-700">
                [Project MATA Phase 3] This is a much future workflow.
            </div>
            <div className="flex w-full items-center space-x-4">
                <Input type="url" placeholder="Enter URL"
                       className="flex w-1/3 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                <Button type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled>
                    Penetrate
                </Button>
            </div>
        </div>
    )
}

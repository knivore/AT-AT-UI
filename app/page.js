"use client";

import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {Spinner} from "@/components/ui/icons";

// Unused page, keeping just to redirect to dashboard if next.config.js does not have the redirect
export default function IndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome to Project MATA</h1>
            <p className="text-lg text-center max-w-xl">
                Redirecting you...
                <div className="flex items-center justify-center min-h-screen">
                    <Spinner/>
                </div>
            </p>
        </div>
    );
}

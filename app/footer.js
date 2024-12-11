'use client';

import {usePathname} from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    if (isDashboard) return null;

    return (
        <footer className="h-24 p-4 bg-gray-100 text-center text-sm text-gray-700 border-t border-gray-300">
            <p className="mt-2 mx-auto max-w-lg">
                This MVP uses Gen AI to perform website testing, and results may vary at times. Please do verify the
                results independently as this is still an early experimental tool.
            </p>
        </footer>
    );
}

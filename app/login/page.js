"use client";

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {AuthError} from "next-auth";

export default function Login() {
    const [email, setEmail] = useState("test@gmail.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [callbackUrl, setCallbackUrl] = useState('/dashboard');

    useEffect(() => {
        const callback = searchParams.get('callbackUrl');
        if (callback) {
            setCallbackUrl(callback);
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (!result.error) {
                router.push(callbackUrl || '/dashboard');
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            if (error instanceof AuthError) {
                setError("Invalid email or password");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleLogin}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Login</h2>
                {error && (
                    <p className="text-red-600 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                    type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

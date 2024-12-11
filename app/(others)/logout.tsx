import {signOut} from 'next-auth/react';

export async function handleLogout(router) {
    try {
        await signOut({redirect: false});
        router.push("/api/auth/signin");
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

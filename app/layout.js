import "./globals.css";

import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import Footer from "@/app/footer";

export const metadata = {
    title: "Project MATA",
    description: "Project MATA (Multimodal Autonomous Testing Agent) is a tool for testing web applications using a combination of visual and semantic analysis sent to Multimodal LLMs.",
    icons: {
        icon: '/images/project_mata.png',
    },
};

export default async function RootLayout({children}) {
    const session = await auth()

    return (
        <html lang="en">
        <body>
        <SessionProvider session={session}>
            {children}
            <Footer/>
        </SessionProvider>
        </body>
        </html>
    );
}

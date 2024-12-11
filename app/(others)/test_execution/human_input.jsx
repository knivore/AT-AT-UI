import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {HelpCircle} from "lucide-react";

const HumanInput = () => {
    const [agentQuery, setAgentQuery] = useState("");
    const [humanResponse, setHumanResponse] = useState("");
    const [showInputBox, setShowInputBox] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const fetchAgentOutput = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/stream-agent-output`,
                {
                    method: "GET",
                    credentials: "include",
                    mode: "cors",
                }
            );

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                const processStream = async () => {
                    const {done, value} = await reader.read();
                    if (done) {
                        setShowInputBox(false);
                        setHumanResponse(""); // Clear the response input
                        return;
                    }

                    const decodedValue = decoder.decode(value, {stream: true});
                    const cleanLines = decodedValue
                        .split("\n")
                        .filter((line) => line.startsWith("data:"))
                        .map((line) => line.replace("data:", "").trim());

                    if (cleanLines.length > 0) {
                        const cleanedMsg = cleanLines.join("\n");
                        setAgentQuery(cleanedMsg);
                        setShowInputBox(true);

                        // Notify user via title and notification
                        const originalTitle = document.title;
                        document.title = "MATA needs your attention!";

                        // After 3 seconds, revert the title to original
                        setTimeout(() => {
                            document.title = originalTitle;
                        }, 3000);

                        // Send a desktop notification if user is not on the tab
                        if (document.hidden && Notification.permission === "granted") {
                            new Notification("Project MATA", {
                                body: "MATA seeks your attention. Click here to respond.",
                            });
                        }
                    }

                    // Recursively read the stream
                    processStream();
                };

                processStream();
            }
        };

        fetchAgentOutput();
    }, [session]);

    const sendHumanInput = async () => {
        await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_API_PATH}/submit-human-input`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: humanResponse,
                    ...session.user.data
                }),
                credentials: "include",
                mode: "cors",
            }
        ).then(r => r.json()).then(data => {
            setShowInputBox(false);
            setAgentQuery(""); // Clear the agent query
            setHumanResponse(""); // Clear the response input
        });
    };

    return (
        <div className="flex flex-col w-full space-y-4">
            <div className="w-full">
                <div className="flex items-center space-x-1 pb-2">
                    <span className="text-sm md:text-base">
                        Agent Question:
                    </span>
                    <div className="relative group">
                        <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer"/>
                        <div
                            className="absolute left-0 bottom-full mb-2 hidden w-max bg-gray-800 text-white text-xs rounded-md p-2 shadow-lg group-hover:block">
                            Agent may prompt you if they require more information.
                        </div>
                    </div>
                </div>
                <textarea
                    name="agent-query"
                    className="w-full p-2 border rounded min-h-[100px] overflow-scroll resize-none bg-gray-100"
                    value={agentQuery}
                    readOnly
                    disabled
                />
                <div className="flex items-center space-x-2">
                    <input
                        name="human-response"
                        type="text"
                        className="flex-grow p-2 border rounded"
                        value={humanResponse}
                        onChange={(e) => setHumanResponse(e.target.value)}
                        placeholder="Enter your response here..."
                        disabled={!showInputBox}
                    />
                    <button
                        className={`p-2 rounded text-white ${
                            showInputBox ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
                        }`}
                        onClick={sendHumanInput}
                        disabled={!showInputBox}
                    >
                        Submit Response
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HumanInput;

import {useState} from 'react';
import useKeySequence from './KeySequence';

export default function HeadlessMode({headlessMode, setHeadlessMode}) {
    const [showHeadlessMode, setShowHeadlessMode] = useState(false);

    const targetSequence = ['ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown'];

    useKeySequence(targetSequence, () => setShowHeadlessMode(true));

    return (
        <div>
            {showHeadlessMode && (
                <div>
                    <div className="flex items-center">
                        <p>You have successfully unlock Project MATA&apos;s hidden feature! Toggle Headless Mode!</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <label className="p-2">
                            <input
                                type="checkbox"
                                id="headlessMode"
                                checked={headlessMode}
                                onChange={(e) => setHeadlessMode(e.target.checked)}
                            /> Headless Mode
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

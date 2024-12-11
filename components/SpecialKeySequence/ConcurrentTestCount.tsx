import {useState} from 'react';
import useKeySequence from './KeySequence';

export default function ConcurrentTestCount({concurrentTestCount, setConcurrentTestCount}) {
    const [showConcurrentTestCount, setShowConcurrentTestCount] = useState(false);

    const targetSequence = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    useKeySequence(targetSequence, () => setShowConcurrentTestCount(true));

    return (
        <div>
            {showConcurrentTestCount && (
                <div>
                    <div className="flex items-center">
                        <p>You have successfully unlock Project MATA&apos;s hidden feature! Run concurrent test
                            cases!</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <label className="p-2">
                            <input
                                type="range"
                                id="concurrentTestCount"
                                onChange={(e) => setConcurrentTestCount(e.target.value)}
                                min="1" max="30" step="1"
                                value={concurrentTestCount}
                            />
                            <p>Run {concurrentTestCount} Concurrent Test Case</p>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

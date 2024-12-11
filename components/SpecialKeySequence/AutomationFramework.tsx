import {useState} from 'react';
import useKeySequence from './KeySequence';

export default function AutomationFramework({selectedFramework, setSelectedFramework}) {
    const [showRadioButtons, setShowRadioButtons] = useState(false);

    const targetSequence = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];

    useKeySequence(targetSequence, () => setShowRadioButtons(true));

    return (
        <div>
            {showRadioButtons && (
                <div>
                    <div className="flex items-center">
                        <p>You have successfully unlock Project MATA&apos;s hidden feature! Choose the type of
                            Automation Framework you want to use!</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <label className="p-2">
                            <input
                                type="radio"
                                name="framework"
                                value="selenium"
                                checked={selectedFramework === 'selenium'}
                                onChange={() => setSelectedFramework('selenium')}
                            /> Selenium
                        </label>
                        <label className="p-2">
                            <input
                                type="radio"
                                name="framework"
                                value="playwright"
                                checked={selectedFramework === 'playwright'}
                                onChange={() => setSelectedFramework('playwright')}
                            /> Playwright
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

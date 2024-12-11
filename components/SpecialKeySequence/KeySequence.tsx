import { useState, useEffect } from 'react';

const useKeySequence = (targetSequence, onSuccess) => {
    const [keySequence, setKeySequence] = useState([]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key } = event;

            setKeySequence((prevSequence) => {
                const updatedSequence = [...prevSequence, key].slice(-targetSequence.length);
                if (JSON.stringify(updatedSequence) === JSON.stringify(targetSequence)) {
                    onSuccess();
                }
                return updatedSequence;
            });
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [targetSequence, onSuccess]);

    return keySequence;
};

export default useKeySequence;

import { useEffect } from 'react';

const useKey = (key, cb) => {
    useEffect(() => {
        const callback = (e) => {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                cb();
            }
        };

        document.addEventListener('keydown', callback);

        return () => document.removeEventListener('keydown', callback);
    }, [key, cb]);
};

export { useKey };

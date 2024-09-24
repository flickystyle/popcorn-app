import { useState, useEffect } from 'react';

const useLocalStorageState = (initialState, key) => {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialState;
    });

    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};

export { useLocalStorageState };

import { useEffect, useRef } from 'react';

const NavBar = ({ children }) => {
    return (
        <nav className="nav-bar">
            <Logo />
            {children}
        </nav>
    );
};

const Search = ({ query, onSetQuery }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        const callback = (e) => {
            if (document.activeElement === inputRef.current) {
                return;
            }

            if (e.code === 'Enter') {
                inputRef.current.focus();
                onSetQuery('');
            }
        };

        document.addEventListener('keydown', callback);

        inputRef.current.focus();

        return () => document.removeEventListener('keydown', callback);
    }, [onSetQuery]);

    return (
        <input
            ref={inputRef}
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => onSetQuery(e.target.value)}
        />
    );
};

const NumResults = ({ results }) => {
    return (
        <p className="num-results">
            Found <strong>{results}</strong> results
        </p>
    );
};

const Logo = () => {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>popcorn App</h1>
        </div>
    );
};

export { Search, NumResults, NavBar };

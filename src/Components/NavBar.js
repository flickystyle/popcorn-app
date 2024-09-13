import { useState } from 'react';

const NavBar = () => {
    const [query, setQuery] = useState('');
    return (
        <nav className="nav-bar">
            <Logo />
            <Search query={query} setQuery={setQuery} />
            <Results results="X" />
        </nav>
    );
};

const Search = ({ query, setQuery }) => {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
};

const Results = ({ results }) => {
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

export default NavBar;

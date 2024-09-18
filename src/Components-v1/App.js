import { useState, useEffect } from 'react';
import Main from './Main';
import { Search, NumResults, NavBar } from './NavBar';
import Loader from './Loader';
import Box from './Box';
import MovieList from './MovieList';
import WatchedMoviesList from './WatchedMoviesList';
import WatchedSummary from './WatchedSummary';
import ErrorMessage from './ErrorMessage';
import MovieDetails from './MovieDetails';

const KEY = '821e56eb';

const App = () => {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setError('');
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
                );
                if (!res.ok) {
                    throw new Error(
                        'Something went wrong with fetching movies...'
                    );
                }

                const data = await res.json();

                if (data.Response === 'False') {
                    throw new Error(data.Error);
                }

                setTimeout(() => setMovies(data.Search), 2000);
            } catch (err) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (query.length < 2) {
            setMovies([]);
            setError('');
            return;
        }

        fetchMovies();
    }, [query]);

    const handleSelectMovie = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };
    const handleCloseMovie = () => {
        setSelectedId(null);
    };
    return (
        <>
            <NavBar moviesCount={movies.length}>
                <Search query={query} onSetQuery={setQuery} />
                <NumResults results={movies.length} />
            </NavBar>

            <Main>
                <Box>
                    {isLoading && <Loader>Loading...</Loader>}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                </Box>

                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList watched={watched} />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
};

export default App;

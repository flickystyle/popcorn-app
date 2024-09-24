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
// const LOCAL_STORAGE_DATA = JSON.parse(localStorage.getItem('watched'));

const App = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    // const [watched, setWatched] = useState(LOCAL_STORAGE_DATA);
    const [watched, setWatched] = useState(() => {
        const storedValue = JSON.parse(localStorage.getItem('watched'));
        return storedValue;
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                setError('');
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                    { signal: controller.signal }
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

                setTimeout(setMovies(data.Search));
                setError('');
            } catch (err) {
                console.error(err.message);
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (query.length < 2) {
            setMovies([]);
            setError('');
            return;
        }
        handleCloseMovie();
        fetchMovies();

        return () => {
            controller.abort();
        };
    }, [query]);

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                handleCloseMovie();
                console.log('close');
            }
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(watched));
    }, [watched]);

    const handleSelectMovie = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };
    const handleCloseMovie = () => {
        setSelectedId(null);
    };

    const handleAddWatched = (movie) => {
        setWatched([...watched, movie]);
        // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
    };

    const handleDeleteWatched = (id) => {
        const filteredMovies = watched.filter((movie) => movie.imdbID !== id);
        setWatched(filteredMovies);
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
                            watched={watched}
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
};

export default App;

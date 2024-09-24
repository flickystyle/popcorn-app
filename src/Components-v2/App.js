import { useState } from 'react';
import Main from './Main';
import { Search, NumResults, NavBar } from './NavBar';
import Loader from './Loader';
import Box from './Box';
import MovieList from './MovieList';
import WatchedMoviesList from './WatchedMoviesList';
import WatchedSummary from './WatchedSummary';
import ErrorMessage from './ErrorMessage';
import MovieDetails from './MovieDetails';
import { useMovies } from '../hooks/useMovies';
import { useLocalStorageState } from '../hooks/useLocalStorageState';


const App = () => {
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    const { movies, isLoading, error } = useMovies(query);
    const [watched, setWatched] = useLocalStorageState([], 'watched');

    const handleSelectMovie = (id) => {
        setSelectedId(id === selectedId ? null : id);
    };
    function handleCloseMovie() {
        setSelectedId(null);
    }

    const handleAddWatched = (movie) => {
        setWatched([...watched, movie]);
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

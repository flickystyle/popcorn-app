import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import Loader from './Loader';
import { useKey } from '../hooks/useKey';

const KEY = '821e56eb';

const MovieDetails = ({ watched, selectedId, onCloseMovie, onAddWatched }) => {
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState(0);

    const countRef = useRef(0);

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    useEffect(() => {
        if (userRating) countRef.current += 1;
    }, [userRating]);

    useEffect(() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
            );
            const data = await res.json();
            setMovie(data);
            setIsLoading(false);
        };
        getMovieDetails();
    }, [selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`;
        return () => (document.title = 'popcorn App');
    }, [title]);

    useKey('Escape', onCloseMovie);

    const handleAdd = () => {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            userRating,
            imdbRating: Number(imdbRating),
            runtime: runtime.split(' ').at(0),
            countRatingDecisions: countRef.current,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    };

    const isMovieWatched = !!watched.find(
        (movie) => movie.imdbID === selectedId
    );
    const watchedMovieRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;

    return (
        <div className="details">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${title} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {isMovieWatched ? (
                                <p>
                                    You rated this movie {watchedMovieRating}
                                    <span> ⭐</span>
                                </p>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        defaultRating={Math.round(imdbRating)}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            + Add to list
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
};

export default MovieDetails;

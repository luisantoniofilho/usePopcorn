import { useState, useRef, useEffect } from "react";
import { useKey } from "../hooks/useKey";
import StarRating from "../StarRating";
import { Loader } from "../ui/Loader";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.id).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.id === selectedId
  )?.userRating;

  const {
    title,
    release_date: releaseDate,
    poster_path: posterPath,
    runtime,
    vote_average: imdbRating,
    overview: plot,
    genres,
    videos,
  } = movie;

  const poster = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "image not found";

  function handleAdd() {
    const newWatchedMovie = {
      id: selectedId,
      title,
      year: releaseDate?.split("-")[0] || "N/A",
      poster,
      imdbRating,
      runtime,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${selectedId}?append_to_response=videos&language=en-US`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTE2ZmRkZjU3NWIyYjlhYmZhMTUwNzFjYTcwZTdmYiIsIm5iZiI6MTczNjc4NjQyNy45NTksInN1YiI6IjY3ODU0MWZiMTM2ZTE1N2NmMjdiNmFiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.q4aIOwxd97yPeT8j4nNs65guyYyISzcUKSaPAOoYvrc`,
          },
        }
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [title]);

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
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {releaseDate?.split("-")[0] || "N/A"} &bull; {runtime || "N/A"}{" "}
                mins
              </p>
              <p>
                {genres?.map((g) => g.name).join(", ") || "No genres available"}
              </p>
              <p>
                <span>⭐️</span>
                {imdbRating?.toFixed(1) || "N/A"} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot || "No description available."}</em>
            </p>
            {videos?.results.length > 0 && (
              <div>
                <h3>Videos</h3>
                {videos.results.map((video) => (
                  <a
                    key={video.id}
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.name}
                  </a>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

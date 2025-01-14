import { useState } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useMovies } from "./hooks/useMovies";
import { Loader } from "./ui/Loader";
import { ErrorMessage } from "./ui/ErrorMessage";
import { NavBar } from "./ui/NavBar";
import { NumResults } from "./ui/NumResults";
import { Main } from "./ui/Main";
import { Box } from "./ui/Box";
import { MovieList } from "./movie/MovieList";
import { MovieDetails } from "./movie/MovieDetails";
import { WatchedSummary } from "./watched/WatchedSummary";
import { WatchedMoviesList } from "./watched/WatchedMoviesList";
import { Search } from "./movie/Search";

export const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
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
}

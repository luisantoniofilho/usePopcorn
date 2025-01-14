import { Movie } from "../movie/Movie";

export function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.id} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

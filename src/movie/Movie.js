export function Movie({ movie, onSelectMovie }) {
  const baseImageUrl = "https://image.tmdb.org/t/p/";
  const imageSize = "w500"; // You can adjust this size based on your needs

  const posterUrl = movie.poster_path
    ? `${baseImageUrl}${imageSize}${movie.poster_path}` // Construct the full URL
    : "Imagem nao encontrada"; // Placeholder for missing posters

  return (
    <li onClick={() => onSelectMovie(movie.id)}>
      <img src={posterUrl} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>
            {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
          </span>
        </p>
      </div>
    </li>
  );
}

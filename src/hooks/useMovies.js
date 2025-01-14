import { useState, useEffect } from "react";

const KEY = "7516fddf575b2b9abfa15071ca70e7fb"; // Your TMDb API key

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(""); // Reset error message before the request starts

        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        console.log(data.results);

        // If no results found
        if (data.results.length === 0) throw new Error("No movies found");

        setMovies(data.results); // Store the search results

        setError(""); // Reset error after successful fetch
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message); // Set the error message
        }
      } finally {
        setIsLoading(false); // Set loading state to false once the fetch is complete
      }
    }

    if (query.length < 2) {
      setMovies([]); // Clear movies if query length is less than 2
      setError(""); // Reset error
      return;
    }

    fetchMovies(); // Trigger the fetch if query length is valid

    return () => {
      controller.abort(); // Abort the fetch if the component unmounts
    };
  }, [query]); // Re-run effect when `query` changes

  return { movies, isLoading, error };
}

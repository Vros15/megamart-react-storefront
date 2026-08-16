import { useState } from "react";
import { useSearchParams } from "react-router";
import "./SearchBar.css";

/**
 * Submitting navigates to `/?search=<query>` instead of calling an API
 * directly - Home reads the same `search` param, so the URL stays the single
 * source of truth and back/forward navigation works for free.
 *
 * Typing is local state, not pushed to the URL on every keystroke - that
 * would spam a new history entry per character. The input's initial value
 * still comes from the URL, so a search already in the address bar shows up
 * pre-filled instead of looking cleared.
 */
const SearchBar = () => {
  // Get the current search query from the URL and initialize local state.
  const [searchParams, setSearchParams] = useSearchParams();
  // Local state for the search input value.
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update the URL search params based on the current query.
    const next = new URLSearchParams(searchParams);
    // Remove any existing search param before setting the new one.
    if (query.trim()) {
      next.set("search", query.trim());
    } else {
      next.delete("search");
    }
    // Apply the updated search params to the URL.
    setSearchParams(next);
  };

  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-bar-input"
        placeholder='Search: try "gaming"'
        aria-label="Search products"
        // Bind the input value to local state and update it on change.
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" className="search-bar-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

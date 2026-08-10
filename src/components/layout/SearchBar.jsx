import "./SearchBar.css";

// Renders a search bar with an input field and a submit button.
const SearchBar = () => {
  // Handle the form submission by preventing the default behavior.
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  // Render the search bar form with input and submit button.
  return (
    <form className="search-bar" role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        className="search-bar-input"
        placeholder='Search — try "gaming"'
        aria-label="Search products"
      />
      <button type="submit" className="search-bar-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

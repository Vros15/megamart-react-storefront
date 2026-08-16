import { Link, useSearchParams } from "react-router";
import CATEGORIES from "../../lib/categories";
import "./CategoryTabs.css";

/**
 * Each tab links to the current URL with `category` set, or removed if the
 * tab clicked is already active - a second click clears the filter, there's
 * no separate "All" tab. Preserving the rest of `searchParams` means an
 * active `search` combines with whichever category gets picked, for free.
 */
const CategoryTabs = () => {
  // Get the current category from the URL to determine which tab is active.
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  // Helper function to generate the href for each category tab based on the current search params.
  const hrefFor = (value) => {
    // Create a new URLSearchParams object to manipulate the query parameters without mutating the original searchParams.
    const next = new URLSearchParams(searchParams);
    // If the current tab is already active, remove the category filter; otherwise, set it to the new value.
    if (activeCategory === value) {
      next.delete("category");
    } else {
      next.set("category", value);
    }
    // Return the full URL including the updated query string.
    const query = next.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <nav className="category-tabs" aria-label="Product categories">
      {CATEGORIES.map((category) => (
        // Render a link for each category tab. The active tab is highlighted.
        <Link
          key={category.value}
          to={hrefFor(category.value)}
          className={`category-tab${activeCategory === category.value ? " category-tab--active" : ""}`}
        >
          {category.label}
        </Link>
      ))}
    </nav>
  );
};

export default CategoryTabs;

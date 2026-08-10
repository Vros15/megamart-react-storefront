import CATEGORIES from "../../lib/categories";
import "./CategoryTabs.css";

/**
 * ToDo: Implement category filtering functionality.
 */
const CategoryTabs = () => (
  <nav className="category-tabs" aria-label="Product categories">
    {CATEGORIES.map((category) => (
      <span key={category.value} className="category-tab">
        {category.label}
      </span>
    ))}
  </nav>
);

export default CategoryTabs;

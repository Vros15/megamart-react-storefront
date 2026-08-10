import "./CategoryTabs.css";

// Pairs the short label shown here with the exact category string stored in
// the API - they differ ("Kitchen" vs "Home & Kitchen")
const CATEGORIES = [
  { label: "Electronics", value: "Electronics" },
  { label: "Audio", value: "Audio" },
  { label: "Home Office", value: "Home Office" },
  { label: "Kitchen", value: "Home & Kitchen" },
  { label: "Fitness", value: "Fitness & Wellness" },
  { label: "Apparel", value: "Apparel & Accessories" },
];

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

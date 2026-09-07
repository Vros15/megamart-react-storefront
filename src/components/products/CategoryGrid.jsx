import { Link, useSearchParams } from "react-router";
import CATEGORIES from "../../lib/categories";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./CategoryGrid.css";

// Finds the first product image for a given category, or returns null if none exists.
const findRepresentativeImage = (products, categoryValue) =>
  products.find((product) => product.category === categoryValue)?.image ?? null;

/**
 * Renders a grid of category tiles, each showing a representative image from
 * the products list. Doubles as the category filter now (replacing the old
 * text tabs): each tile links to the current URL with `category` set, or
 * removed if the tile clicked is already active - a second click clears the
 * filter, there's no separate "All" tile. Preserving the rest of
 * `searchParams` means an active `search` combines with whichever category
 * gets picked, for free.
 */
const CategoryGrid = ({ products }) => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const hrefFor = (value) => {
    const next = new URLSearchParams(searchParams);
    if (activeCategory === value) {
      next.delete("category");
    } else {
      next.set("category", value);
    }
    const query = next.toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <section className="category-grid-section">
      <h2>Shop by category</h2>
      <div className={`category-grid${activeCategory ? " category-grid--filtered" : ""}`}>
        {CATEGORIES.map((category) => (
          <Link
            key={category.value}
            to={hrefFor(category.value)}
            className={`category-tile${activeCategory === category.value ? " category-tile--active" : ""}`}
          >
            <div className="category-tile-image-well">
              <ImageWithFallback
                src={findRepresentativeImage(products, category.value)}
                alt=""
                imageClassName="category-tile-image"
                fallbackClassName="category-tile-image-fallback"
              />
            </div>
            <p className="category-tile-label">{category.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;

import CATEGORIES from "../../lib/categories";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./CategoryGrid.css";

// Finds the first product image for a given category, or returns null if none exists.
const findRepresentativeImage = (products, categoryValue) =>
  products.find((product) => product.category === categoryValue)?.image ?? null;

// Renders a grid of category tiles, each showing a representative image from the products list.
const CategoryGrid = ({ products }) => (
  <section className="category-grid-section">
    <h2>Shop by category</h2>
    <div className="category-grid">
      {CATEGORIES.map((category) => (
        <div key={category.value} className="category-tile">
          <div className="category-tile-image-well">
            <ImageWithFallback
              src={findRepresentativeImage(products, category.value)}
              alt=""
              imageClassName="category-tile-image"
              fallbackClassName="category-tile-image-fallback"
            />
          </div>
          <p className="category-tile-label">{category.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default CategoryGrid;

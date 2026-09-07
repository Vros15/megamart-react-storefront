import { useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { fetchProducts } from "../api/products";
import useFetch from "../hooks/useFetch";
import { MAX_PRODUCTS_LIMIT } from "../lib/constants";
import ProductGrid from "../components/products/ProductGrid";
import CategoryGrid from "../components/products/CategoryGrid";
import SortSelect from "../components/products/SortSelect";
import Spinner from "../components/ui/Spinner";
import "./Home.css";

// Unfiltered, module scope for a stable reference (see fetchFilteredProducts
// below). CategoryGrid needs every category's real photo regardless of
// which filter is active, so it can't share the filtered fetch below - that
// only ever contains one category's products while filtered, which is what
// broke the other tiles' images.
const fetchAllProductsForTiles = () => fetchProducts({ limit: MAX_PRODUCTS_LIMIT });

const Home = () => {
  // Get the current search/category/sort from the URL and determine if a filter is active.
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "";
  const hasActiveFilter = Boolean(search || category);
  // The category tiles are the category filter now - hiding them whenever
  // one's active would remove the only way to switch or clear it. They
  // still hide on a search, same as the hero, since a text search turns the
  // page into results mode.
  const hideCategoryGrid = Boolean(search);

  // Fetch products filtered by the current search/category, sorted by sortBy/sortOrder.
  const fetchFilteredProducts = useCallback(
    () => fetchProducts({ limit: MAX_PRODUCTS_LIMIT, search, category, sortBy, sortOrder }),
    [search, category, sortBy, sortOrder],
  );
  // Use the custom hook to fetch the filtered products.
  const { data, loading, error } = useFetch(fetchFilteredProducts);
  // Separate, unfiltered fetch just for the category tiles' photos.
  const { data: allProductsData } = useFetch(fetchAllProductsForTiles);

  return (
    <>
      {/* Hero section, only shown when no filter is active. */}
      {!hasActiveFilter && (
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-hero-badge">*Back to School Season*</span>
            <h1 className="home-hero-headline">
              Modern essentials for work, home and everyday performance.
            </h1>
            <p className="home-hero-subtext">Six categories, everything you need for work, home, and play.</p>
            <div className="home-hero-actions">
              {/* Both link to "/" for now - there's nothing to link to yet. */}
              <Link to="/" className="home-hero-button-primary">
                Shop the catalogue
              </Link>
              <Link to="/" className="home-hero-button-secondary">
                Gaming setup
              </Link>
            </div>
          </div>
          {/* Decorative - the headline and subtext already say everything the photo shows. */}
          <img src="/heroImg.png" alt="" className="home-hero-image" />
        </section>
      )}

      {/* Category grid: doubles as the category filter, stays visible while
          one's active, hides only on a search. */}
      {!hideCategoryGrid && <CategoryGrid products={allProductsData?.products ?? []} />}

      <div className="home-toolbar">
        <SortSelect />
      </div>

      {/* Request status */}
      {loading && <Spinner />}

      {error && (
        <p className="home-error">
          Could not load products: {error}
        </p>
      )}
      {/* Product results - data.products is passed to the ProductGrid component */}
      {data && <ProductGrid products={data.products} />}
    </>
  );
};

export default Home;

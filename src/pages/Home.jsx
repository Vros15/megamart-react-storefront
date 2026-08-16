import { useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { fetchProducts } from "../api/products";
import useFetch from "../hooks/useFetch";
import { MAX_PRODUCTS_LIMIT } from "../lib/constants";
import ProductGrid from "../components/products/ProductGrid";
import CategoryTabs from "../components/products/CategoryTabs";
import CategoryGrid from "../components/products/CategoryGrid";
import Spinner from "../components/ui/Spinner";
import "./Home.css";

const Home = () => {
  // Get the current search query from the URL and determine if a filter is active.
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const hasActiveFilter = Boolean(search);

  // Fetch products filtered by the current search query.
  const fetchFilteredProducts = useCallback(
    () => fetchProducts({ limit: MAX_PRODUCTS_LIMIT, search }),
    [search],
  );
  // Use the custom hook to fetch the filtered products.
  const { data, loading, error } = useFetch(fetchFilteredProducts);

  return (
    <>
      <CategoryTabs />

      {/* Hero section, only shown when no search filter is active. */}
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

     {/* Category grid, only shown when no search filter is active. */}
           {!hasActiveFilter && <CategoryGrid products={data?.products ?? []} />}

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

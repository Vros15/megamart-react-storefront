import { Link } from "react-router";
import { fetchProducts } from "../api/products";
import useFetch from "../hooks/useFetch";
import ProductGrid from "../components/products/ProductGrid";
import CategoryTabs from "../components/products/CategoryTabs";
import CategoryGrid from "../components/products/CategoryGrid";
import Spinner from "../components/ui/Spinner";
import "./Home.css";

const Home = () => {
  // Fetch products and track the request state.
  const { data, loading, error } = useFetch(fetchProducts);

  return (
    <>
      <CategoryTabs />

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-badge">*Back to School Season*</span>
          <h1 className="home-hero-headline">
            Modern essentials for work, home and everyday performance.
          </h1>
          <p className="home-hero-subtext">Six categories, twenty things worth owning.</p>
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

      {/* Tolerates loading with an empty array - tiles fall back to a
          placeholder until real products arrive. */}
      <CategoryGrid products={data?.products ?? []} />

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

import { fetchProducts } from "../api/products";
import useFetch from "../hooks/useFetch";
import ProductGrid from "../components/products/ProductGrid";
import CategoryTabs from "../components/products/CategoryTabs";
import Spinner from "../components/ui/Spinner";
import "./Home.css";

const Home = () => {
  // Fetch products and track the request state.
  const { data, loading, error } = useFetch(fetchProducts);

  return (
    <>
      <CategoryTabs />

      <h1>Shop MegaMart</h1>

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

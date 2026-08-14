import { useState } from "react";
import { fetchProducts } from "../../api/products";
import useFetch from "../../hooks/useFetch";
import { MAX_PRODUCTS_LIMIT } from "../../lib/constants";
import AdminProductList from "./AdminProductList";
import ProductForm from "./ProductForm";
import Spinner from "../ui/Spinner";
import "./AdminDashboard.css";

// Defined once at module scope, not inline in the component - useFetch's
// effect depends on this reference, and a new function every render would
// refetch every render. Requests the API's max rather than the unset
// default of 20 - an admin managing the catalogue needs to see all of it,
// not silently lose whatever's past the 20th product.
const fetchAllProducts = () => fetchProducts({ limit: MAX_PRODUCTS_LIMIT });

// Maps a thrown write error to what a person should actually be told. A
// single generic message for every failure would make the next real bug
// much harder to notice.
const describeWriteError = (err) => {
  if (err.status === 401) return "Your session expired. Sign in again.";
  if (err.status === 403) return "This account cannot make changes.";
  if (err.status === 429) return "Too many requests. Wait a moment and try again.";
  return err.message || "Something went wrong.";
};

/**
 * Product management - create, edit, list. Takes `write` as a prop rather
 * than calling useAdminApi itself, so this can be tested with a fake
 * success/failure function and no real Clerk sign-in. Admin.jsx, which owns
 * the access gate, passes the real one.
 */
const AdminDashboard = ({ write }) => {
  const { data, loading, error, refetch } = useFetch(fetchAllProducts);

  // null while showing the list, "create" for a new product, or the product
  // object being edited.
  const [formTarget, setFormTarget] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isCreating = formTarget === "create";

  const handleSubmit = async (payload) => {
    setSaving(true);
    setActionError(null);

    try {
      if (isCreating) {
        await write("POST", "/products", payload);
      } else {
        await write("PUT", `/products/${formTarget.id}`, payload);
      }
      setFormTarget(null);
      refetch();
    } catch (err) {
      setActionError(describeWriteError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {actionError && <p className="admin-dashboard-message">{actionError}</p>}

      {formTarget ? (
        <>
          {/*
            Keyed by target so switching from create to edit, or between two
            different products, remounts the form - ProductForm's state is
            only initialized once per mount, so without this it would keep
            showing whichever product's values it started with.
          */}
          <ProductForm
            key={isCreating ? "create" : formTarget.id}
            initialValues={isCreating ? undefined : formTarget}
            onSubmit={handleSubmit}
            submitLabel={saving ? "Saving…" : isCreating ? "Create" : "Save"}
            disabled={saving}
          />
          <button type="button" className="admin-cancel-button" onClick={() => setFormTarget(null)}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" className="admin-add-button" onClick={() => setFormTarget("create")}>
          Add Product
        </button>
      )}

      {loading && <Spinner />}

      {error && <p className="admin-dashboard-message">Could not load products: {error}</p>}

      {data && !formTarget && <AdminProductList products={data.products} onEdit={setFormTarget} />}
    </>
  );
};

export default AdminDashboard;
export { describeWriteError };

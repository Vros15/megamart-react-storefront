import { useCallback } from "react";
import { Link } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import { fetchMyOrders } from "../api/orders";
import useFetch from "../hooks/useFetch";
import { formatPrice } from "../lib/format";
import Spinner from "../components/ui/Spinner";
import "./Orders.css";

/**
 * Signed-in gated, matching Admin.jsx's shape. The backend's GET
 * /api/orders/me is the real boundary (a request with no valid token gets a
 * 401) - this gate only decides what renders.
 *
 * The fetcher stays pending forever while signed out or before Clerk has
 * finished loading, rather than resolving early - that keeps useFetch's
 * `loading` true across the moment isSignedIn flips, instead of briefly
 * rendering an empty order list before the real fetch has even started.
 */
const Orders = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const fetchOrders = useCallback(() => {
    if (!isLoaded || !isSignedIn) return new Promise(() => {});
    return getToken().then((token) => fetchMyOrders(token));
  }, [isLoaded, isSignedIn, getToken]);

  const { data: orders, loading, error } = useFetch(fetchOrders);

  if (!isLoaded) {
    return <Spinner />;
  }

  if (!isSignedIn) {
    return (
      <>
        <h1 className="orders-gate-message">Are you signed in?</h1>
        <p className="orders-gate-message">
          <Link to="/">Go back home</Link>
        </p>
      </>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="orders-gate-message">{error}</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <h1>Your Orders</h1>
        <p className="orders-empty">
          No orders yet. <Link to="/">Start shopping</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Your Orders</h1>
      <ul className="orders-list">
        {orders.map((order) => (
          <li key={order._id} className="orders-order">
            <div className="orders-order-header">
              <span className="orders-order-date">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="orders-order-total tabular">{formatPrice(order.totalPrice)}</span>
            </div>
            <ul className="orders-order-items">
              {order.products.map((item) => (
                <li key={item._id} className="orders-order-item">
                  <span className="orders-order-item-name">
                    {item.productId?.name ?? "Product no longer available"}
                  </span>
                  <span className="orders-order-item-qty">x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Orders;

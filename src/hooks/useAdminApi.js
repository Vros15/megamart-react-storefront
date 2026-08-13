import { useAuth } from "@clerk/clerk-react";
import { API_BASE_URL } from "../lib/constants";

// Hook for making authenticated write requests (POST/PUT/DELETE) to the admin API.
const useAdminApi = () => {
  // Get the function to retrieve the current user's authentication token.
  const { getToken } = useAuth();

  // Function to make authenticated write requests.
  // `method` should be one of "POST", "PUT", or "DELETE".
  // `path` is the API endpoint path, e.g., "/products".
  // `body` is the request payload, if applicable.
  const write = async (method, path, body) => {
    // Retrieve the current user's authentication token before making the request.
    const token = await getToken();

    // Include the authentication token in the request headers.
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    // Throw an error if the response was not successful.
    // Successful responses carry no `success` flag - the status is the only
    // reliable signal, never branch on body.success.
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw Object.assign(new Error(payload.message || "Request failed"), {
        status: response.status,
        code: payload.code,
      });
    }

    return payload;
  };

  return { write };
};

export default useAdminApi;

// Initial state for the cart. Items are stored as a flat array.
const initialCartState = {
  items: [],
};

// Adds a product to the cart, or increments its quantity if it is already present. Only the fields a cart line needs are kept - id, name, price, image, quantity.
const addItem = (state, product) => {
  // Check if the product is already in the cart.
  const existing = state.items.find((item) => item.id === product.id);

  // If it exists, increment its quantity. Otherwise, add it as a new item.
  if (existing) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    };
  }
  // Return the new state with the added item.
  return {
    ...state,
    items: [
      ...state.items,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    ],
  };
};

// Reducer for cart state. Only ADD_ITEM exists so far. Throws on an unrecognized action type.
const cartReducer = (state, action) => {
  // Determine the action type and delegate to the appropriate handler.
  switch (action.type) {
    case "ADD_ITEM":
      return addItem(state, action.payload);
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
};

export { cartReducer, initialCartState };

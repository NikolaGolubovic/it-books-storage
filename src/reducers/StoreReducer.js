import ACTIONS from "./Actions";
import { newBooksInitial } from "./InitialStates";

export function reducer(state, action) {
  const sliderType = action.payload?.sliderType;
  if (action.type === ACTIONS.NEW_BOOKS) {
    return { ...state, newBooks: newBooksInitial };
  }
  if (action.type === ACTIONS.NEXT_SLIDER_NEW) {
    return {
      ...state,
      [sliderType]: [
        state[sliderType][state[sliderType].length - 1],
        ...state[sliderType].slice(0, state[sliderType].length - 1),
      ],
    };
  }
  if (action.type === ACTIONS.BACK_SLIDER_NEW) {
    return {
      ...state,
      [sliderType]: [
        ...state[sliderType].slice(1, state[sliderType].length),
        state[sliderType][0],
      ],
    };
  }
  if (action.type === ACTIONS.JAVASCRIPT_BOOKS) {
    return {
      ...state,
      javascript: action.payload.books,
    };
  }
  if (action.type === ACTIONS.PYTHON_BOOKS) {
    return {
      ...state,
      python: action.payload.books,
    };
  }
  if (action.type === ACTIONS.FAVORITE_ITEMS_NUMBER) {
    let favorites = JSON.parse(
      window.localStorage.getItem(
        `${process.env.REACT_APP_STORAGE_NAME}-favorites`
      )
    );
    return {
      ...state,
      favoritesTotal: !favorites ? 0 : favorites.length,
    };
  }
  if (action.type === ACTIONS.CART_ITEMS_NUMBER) {
    const cart = JSON.parse(
      window.localStorage.getItem(`${process.env.REACT_APP_STORAGE_NAME}-cart`)
    );
    const totalOrder =
      cart?.length > 0
        ? cart.reduce(
            (previousValue, currentValue) => previousValue + currentValue.total,
            0
          )
        : 0;
    return {
      ...state,
      cartTotal: totalOrder,
    };
  }
  if (action.type === ACTIONS.ORDER_BOOKS) {
    console.log("payload", action.payload);
    return {
      ...state,
      order: {
        items: action.payload.orderedItems,
        totalPrice: action.payload.total,
      },
    };
  }
  if (action.type === ACTIONS.FAVORITE_BOOKS) {
    return {
      ...state,
      favorites: action.payload.favorites,
    };
  }
  if (action.type === ACTIONS.CART_INCLUDES_BOOKS) {
    return {
      ...state,
      cart: action.payload.cart,
    };
  }
  return state;
}

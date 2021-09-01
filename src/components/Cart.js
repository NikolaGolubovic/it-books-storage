import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { StoreContext as Store } from "../contexts/StoreContext";
import ACTIONS from "../reducers/Actions";

const storageFavorites = `${process.env.REACT_APP_STORAGE_NAME}-favorites`;
const storageCart = `${process.env.REACT_APP_STORAGE_NAME}-cart`;

const Cart = () => {
  const storeContext = useContext(Store);
  const [cart, setCart] = useState([]);
  const [numOfCopies, setNumOfCopies] = useState([]);
  const history = useHistory();

  function calculateTotal(cart, numOfCopies) {
    return cart
      .reduce((previous, current, index) => {
        return previous + Number(current.price.slice(1)) * numOfCopies[index];
      }, 0)
      .toFixed(2);
  }

  useEffect(() => {
    console.log(storeContext);
    let cartInLocal = JSON.parse(window.localStorage.getItem(storageCart));
    cartInLocal && setNumOfCopies(cartInLocal.map((elem) => elem.total));
    if (cartInLocal) {
      cartInLocal = cartInLocal.map((book) =>
        fetch(`https://api.itbook.store/1.0/books/${book.id}`)
      );
      Promise.all(cartInLocal)
        .then((res) => {
          return Promise.all(res.map((res) => res.json()));
        })
        .then((data) => {
          setCart([...cart, ...data]);
        });
    }
  }, []);

  function addToFavorite(id) {
    const favorites = JSON.parse(window.localStorage.getItem(storageFavorites));
    const cartInLocal = JSON.parse(window.localStorage.getItem(storageCart));
    if (!favorites) {
      window.localStorage.setItem(storageFavorites, JSON.stringify([id]));
      window.localStorage.setItem(
        storageCart,
        JSON.stringify(cartInLocal.filter((elem) => elem.id !== id))
      );
      storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
      storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
    } else {
      if (favorites.includes(id)) {
        return;
      }
    }
    favorites.push(id);
    const filteredCart = cartInLocal.filter((elem) => elem.id !== id);
    window.localStorage.setItem(storageFavorites, JSON.stringify(favorites));
    window.localStorage.setItem(storageCart, JSON.stringify(filteredCart));
    storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
    storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
    setCart(cart.filter((elem) => elem.isbn13 !== id));
  }

  function cartRemove(id) {
    const cartInLocal = JSON.parse(window.localStorage.getItem(storageCart));
    window.localStorage.setItem(
      storageCart,
      JSON.stringify(cartInLocal.filter((elem) => elem.id !== id))
    );
    storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
    setCart(cart.filter((elem) => elem.isbn13 !== id));
  }

  function addCopy(id, copyNum) {
    const cartInLocal = JSON.parse(window.localStorage.getItem(storageCart));
    const moreCopy = cartInLocal.map((elem) =>
      elem.id === id ? { ...elem, total: elem.total + 1 } : elem
    );
    window.localStorage.setItem(storageCart, JSON.stringify(moreCopy));
    setNumOfCopies(
      numOfCopies.map((copy, index) => (index === copyNum ? (copy += 1) : copy))
    );
    storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
  }

  function removeCopy(id, copyNum) {
    const cartInLocal = JSON.parse(window.localStorage.getItem(storageCart));
    const lessCopy = cartInLocal.map((elem) =>
      elem.id === id
        ? { ...elem, total: elem.total > 2 ? elem.total - 1 : 1 }
        : elem
    );
    window.localStorage.setItem(storageCart, JSON.stringify(lessCopy));
    setNumOfCopies(
      numOfCopies.map((copy, index) =>
        index === copyNum ? (copy >= 2 ? (copy -= 1) : 1) : copy
      )
    );
    storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
  }

  const toOrder = (total) => {
    const orderedItems = [];
    cart.forEach((elem, index) =>
      orderedItems.push({
        image: elem.image,
        title: elem.title,
        price: +elem.price.slice(1),
        copies: numOfCopies[index],
      })
    );
    storeContext.dispatch({
      type: ACTIONS.ORDER_BOOKS,
      payload: { orderedItems, total },
    });
    history.push("/order");
  };

  return (
    <div className="favorite-books">
      {cart.length > 0 &&
        cart.map((book, index) => {
          return (
            <div className="favorite-book" key={book.title}>
              <h3>{book.title}</h3>
              <img src={book.image} alt={book.title} />
              <div className="favorite-book__shop-controller">
                <button onClick={() => addToFavorite(book.isbn13)}>
                  Add to Favorite
                </button>
                <button onClick={() => cartRemove(book.isbn13)}>
                  Remove from Cart
                </button>
              </div>
              <p>{book.desc}</p>
              <p>
                {`${(+book.price.slice(1) * numOfCopies[index]).toFixed(2)}`}$
              </p>

              <div className="favorite-book__copy-controller">
                <p>Num of Copies</p>
                <button onClick={() => removeCopy(book.isbn13, index)}>
                  -
                </button>
                <p className="favorite-book__copy-controller__copy-number">
                  {numOfCopies[index]}
                </p>
                <button onClick={() => addCopy(book.isbn13, index)}>+</button>
              </div>
            </div>
          );
        })}
      <h1>Total: {cart.length > 0 && calculateTotal(cart, numOfCopies)}$</h1>
      <button
        className="favorite-books__btn-order"
        onClick={() => toOrder(calculateTotal(cart, numOfCopies))}
      >
        Order
      </button>
    </div>
  );
};

export default Cart;

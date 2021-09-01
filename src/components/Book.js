import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { StoreContext } from "../contexts/StoreContext";
import ACTIONS from "../reducers/Actions";
import { storageFavorites, storageCart } from "../data/storageNames";

const Book = () => {
  const [book, setBook] = useState(null);
  const [favoritesInLocal, setFavoritesInLocal] = useState([]);
  const [cartInLocal, setCartInLocal] = useState([]);
  const paramsId = useParams().id;
  const storeContext = useContext(StoreContext);
  function addToFavorite(id) {
    const favorites = JSON.parse(window.localStorage.getItem(storageFavorites));
    if (!favorites || favorites.length === 0) {
      window.localStorage.setItem(storageFavorites, JSON.stringify([id]));
      storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
      setFavoritesInLocal([...favoritesInLocal, id]);
    } else {
      if (favorites.includes(id)) {
        const favoriteOut = favorites.filter((elem) => elem !== id);
        window.localStorage.setItem(
          storageFavorites,
          JSON.stringify(favoriteOut)
        );
        storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
        setFavoritesInLocal(favoritesInLocal.filter((elem) => elem !== id));
        return;
      }
      favorites.push(id);
      window.localStorage.setItem(storageFavorites, JSON.stringify(favorites));
      storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
      setFavoritesInLocal([...favorites, id]);
    }
  }
  function addToShop(id, price) {
    let cart = JSON.parse(window.localStorage.getItem(storageCart));
    if (!cart) {
      window.localStorage.setItem(
        storageCart,
        JSON.stringify([{ id, price, total: 1 }])
      );
      storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
      setCartInLocal([{ id, price, total: 1 }]);
    } else {
      if (cart.find((elem) => elem.id === id)) {
        cart = cart.map((elem) =>
          elem.id === id ? { ...elem, total: elem.total + 1 } : elem
        );
      } else {
        cart.push({ id, price, total: 1 });
      }
      window.localStorage.setItem(storageCart, JSON.stringify(cart));
      setCartInLocal(cart);
      storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
    }
  }
  useEffect(() => {
    fetch(`https://api.itbook.store/1.0/books/${paramsId}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
      });
  }, [paramsId]);

  useEffect(() => {
    setFavoritesInLocal(
      JSON.parse(window.localStorage.getItem(storageFavorites))
    );
    setCartInLocal(JSON.parse(window.localStorage.getItem(storageCart)));
  }, []);

  if (!book) {
    return "No Book";
  }

  return (
    <div className="single-book">
      <h1>{book?.title}</h1>
      <img src={book?.image} alt="" />
      <p>{book?.desc}</p>
      <p>{book?.price}</p>
      <div className="results__shop__options">
        <button
          onClick={() => addToFavorite(book.isbn13)}
          style={{
            background: favoritesInLocal?.includes(book.isbn13) && "red",
          }}
        >
          {favoritesInLocal?.includes(book.isbn13) ? "Liked" : "Favorite"}
        </button>
        <button
          onClick={() => addToShop(book.isbn13, book.price)}
          style={{
            background:
              cartInLocal?.find((elem) => elem.id === book.isbn13) &&
              "rgb(0, 180, 216)",
          }}
        >
          {cartInLocal?.find((elem) => elem.id === book.isbn13)
            ? "More Copies"
            : "To Cart"}
        </button>
      </div>
    </div>
  );
};

export default Book;

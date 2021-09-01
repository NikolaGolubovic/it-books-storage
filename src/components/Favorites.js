import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../contexts/StoreContext";
import ACTIONS from "../reducers/Actions";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const storeContext = useContext(StoreContext);

  const storageFavorites = `${process.env.REACT_APP_STORAGE_NAME}-favorites`;
  const storageCart = `${process.env.REACT_APP_STORAGE_NAME}-cart`;

  useEffect(() => {
    let favoritesInLocal = JSON.parse(
      window.localStorage.getItem(storageFavorites)
    );

    if (favoritesInLocal) {
      favoritesInLocal = favoritesInLocal.map((bookId) =>
        fetch(`https://api.itbook.store/1.0/books/${bookId}`)
      );
      Promise.all(favoritesInLocal)
        .then((res) => {
          return Promise.all(res.map((res) => res.json()));
        })
        .then((data) => {
          setFavorites([...favorites, ...data]);
        });
    }
  }, []);

  function removeFavorite(id) {
    const favoritesLocal = JSON.parse(
      window.localStorage.getItem(storageFavorites)
    );
    const favoritesLocalOut = favoritesLocal.filter((elem) => elem !== id);
    window.localStorage.setItem(
      storageFavorites,
      JSON.stringify(favoritesLocalOut)
    );
    storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
    console.log(favorites);
    setFavorites(favorites.filter((elem) => elem.isbn13 !== id));
    return;
  }

  function toCart(id, price) {
    let cartLocal = JSON.parse(window.localStorage.getItem(storageCart));
    let favoritesLocal = JSON.parse(
      window.localStorage.getItem(storageFavorites)
    );
    if (!cartLocal) {
      console.log("hello");
      window.localStorage.setItem(
        storageCart,
        JSON.stringify([{ id, price, total: 1 }])
      );
      storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
      setFavorites([{ id, price, total: 1 }]);
    } else {
      if (cartLocal.find((elem) => elem.id === id)) {
        cartLocal = cartLocal.map((elem) =>
          elem.id === id ? { ...elem, total: elem.total + 1 } : elem
        );
      } else {
        cartLocal.push({ id, price, total: 1 });
      }
      setFavorites(favorites.filter((favorite) => favorite.isbn13 !== id));

      const filteredLocal = favoritesLocal.filter((elemId) => elemId !== id);

      window.localStorage.setItem(
        storageFavorites,
        JSON.stringify(filteredLocal)
      );
      window.localStorage.setItem(storageCart, JSON.stringify(cartLocal));
      storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
      storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
      window.localStorage.setItem(storageCart, JSON.stringify(cartLocal));
    }
  }
  return (
    <div className="favorite-books">
      {favorites.length > 0 &&
        favorites.map((book) => {
          return (
            <div className="favorite-book" key={book.title}>
              <h3>{book.title}</h3>
              <img src={book.image} alt={book.title} />
              <p>{book.desc}</p>
              <p className="favorite_book__price">{book.price}</p>
              <div className="favorite-books__controller">
                <button onClick={() => removeFavorite(book.isbn13)}>
                  Remove
                </button>
                <button onClick={() => toCart(book.isbn13, book.price)}>
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Favorites;

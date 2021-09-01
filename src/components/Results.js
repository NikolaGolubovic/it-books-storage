import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StoreContext } from "../contexts/StoreContext";
import ReactPaginate from "react-paginate";
import ACTIONS from "../reducers/Actions";
import { storageFavorites, storageCart } from "../data/storageNames";

const Results = ({ match }) => {
  // add book year
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [favoritesInLocal, setFavoritesInLocal] = useState([]);
  const [cartInLocal, setCartInLocal] = useState([]);
  const field = useParams().id;

  const storeContext = useContext(StoreContext);

  function handlePageClick(data) {
    setPage(data.selected + 1);
  }
  function addToFavorite(id) {
    const favorites = JSON.parse(window.localStorage.getItem(storageFavorites));
    if (!favorites || favorites.length === 0) {
      window.localStorage.setItem(storageFavorites, JSON.stringify([id]));
      storeContext.dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
      setFavoritesInLocal([id]);
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
    fetch(`https://api.itbook.store/1.0/search/${field}/${page}`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(+data.total);
        setBooks(data.books);
      });
  }, [page, field, storeContext.favorites]);

  useEffect(() => {
    setFavoritesInLocal(storeContext.favorites);
    setCartInLocal(storeContext.cart);
  }, [storeContext.favorites, storeContext.cart]);

  return (
    <div>
      <ul className="results">
        {books.map((book) => {
          return (
            <li key={book.isbn13} className="results__book">
              <img src={book.image} alt="" />
              <div className="results__book__desc">
                <h4>
                  <Link to={`/book/${book.isbn13}`}>{book.title}</Link>
                </h4>
                <small>{book.subtitle.split(" ").slice(0, 10).join(" ")}</small>
              </div>
              <p>{book.price}</p>
              <div className="results__shop__options">
                <button
                  onClick={() => addToFavorite(book.isbn13)}
                  style={{
                    background:
                      favoritesInLocal?.includes(book.isbn13) && "red",
                  }}
                >
                  {favoritesInLocal?.includes(book.isbn13)
                    ? "Liked"
                    : "Favorite"}
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
            </li>
          );
        })}
      </ul>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={total / 10}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        containerClassName={"pagination"}
        activeClassName={"active"}
        onPageChange={handlePageClick}
      />
    </div>
  );
};

export default Results;

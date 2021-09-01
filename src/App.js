import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import { StoreContext as Store } from "./contexts/StoreContext";
import { storageFavorites, storageCart } from "./data/storageNames";

import ACTIONS from "./reducers/Actions";
import Results from "./components/Results";
import Homepage from "./components/Homepage";
import Nav from "./components/Nav";
import Fields from "./components/Fields";
import Book from "./components/Book";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import Order from "./components/Order";

function App() {
  const StoreContext = useContext(Store);

  function getBooks(dispatch, type) {
    fetch(`https://api.itbook.store/1.0/search/${type}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: ACTIONS[`${type.toUpperCase()}_BOOKS`],
          payload: { books: data.books },
        });
      })
      .catch((err) => console.log("err", err));
  }

  function getFavorites() {
    const favorites = JSON.parse(window.localStorage.getItem(storageFavorites));
    return favorites;
  }

  function getCart() {
    const cart = JSON.parse(window.localStorage.getItem(storageCart));
    return cart;
  }

  useEffect(() => {
    StoreContext.dispatch(() => getBooks(StoreContext.dispatch, "javascript"));
    StoreContext.dispatch(() => getBooks(StoreContext.dispatch, "python"));
    StoreContext.dispatch({
      type: ACTIONS.FAVORITE_BOOKS,
      payload: { favorites: getFavorites() },
    });
    StoreContext.dispatch({
      type: ACTIONS.CART_INCLUDES_BOOKS,
      payload: { cart: getCart() },
    });
  }, []);

  return (
    <Router>
      <div className="container">
        <Nav />
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/fields" component={Fields} />
          <Route path="/field/:id" component={Results} exact />
          <Route path="/book/:id" component={Book} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/order" component={Order} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

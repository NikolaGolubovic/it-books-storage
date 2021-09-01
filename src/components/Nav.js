import React, { useContext, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { StoreContext as Store } from "../contexts/StoreContext";
import ACTIONS from "../reducers/Actions";

const Nav = () => {
  const storeContext = useContext(Store);
  const user = storeContext.currentUser;

  const dispatch = storeContext.dispatch;

  useEffect(() => {
    dispatch({ type: ACTIONS.FAVORITE_ITEMS_NUMBER });
    dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
  }, []);

  function logout() {
    window.localStorage.removeItem(
      `${process.env.REACT_APP_STORAGE_NAME}-user`
    );
    storeContext.logout();
    window.location.reload();
  }
  return (
    <nav>
      <NavLink exact to="/" activeClassName="nav-active">
        Home
      </NavLink>
      <NavLink to="/fields" activeClassName="nav-active">
        Books
      </NavLink>
      <NavLink to="/favorites" activeClassName="nav-active">
        Favorites ({storeContext.favoritesTotal}){" "}
      </NavLink>
      <NavLink to="/cart" activeClassName="nav-active">
        Cart ({storeContext.cartTotal})
      </NavLink>
      {!user && (
        <>
          {" "}
          <NavLink to="/signup" activeClassName="nav-active">
            Sign Up
          </NavLink>
          <NavLink to="/login" activeClassName="nav-active">
            Login
          </NavLink>{" "}
        </>
      )}
      {user && (
        <NavLink to="/" onClick={logout} activeClassName="nav-active">
          Logout
        </NavLink>
      )}
    </nav>
  );
};

export default Nav;

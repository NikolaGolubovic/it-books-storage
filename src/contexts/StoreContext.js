import React, { useReducer, createContext, useEffect, useState } from "react";

import ACTIONS from "../reducers/Actions";
import { reducer } from "../reducers/StoreReducer";
import { useThunkReducer } from "../reducers/Thunks";

import { auth } from "../config/firebase";

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [books, dispatch] = useThunkReducer(reducer, {});
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem(`${process.env.REACT_APP_STORAGE_NAME}-user`) ||
      ""
  );

  useEffect(() => {
    dispatch({ type: ACTIONS.NEW_BOOKS });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (
        window.localStorage.getItem(
          `${process.env.REACT_APP_STORAGE_NAME}-user`
        )
      ) {
        return;
      } else if (user?.email) {
        setCurrentUser(user.email);
        window.localStorage.setItem(
          `${process.env.REACT_APP_STORAGE_NAME}-user`,
          user.email
        );
      }
    });

    return unsubscribe;
  }, []);

  function signup(email, password, fullName, street, mobile) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  const value = {
    newBooks: {
      books: books.newBooks,
      title: "New Books",
    },
    javascript: {
      books: books.javascript,
      title: "JavaScript Books",
    },
    python: {
      books: books.python,
      title: "Python Books",
    },
    favorites: books.favorites || null,
    cart: books.cart || null,
    favoritesTotal: 0 || books.favoritesTotal,
    cartTotal: 0 || books.cartTotal,
    order: books.order,
    dispatch,
    currentUser,
    signup,
    logout,
    login,
  };
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;

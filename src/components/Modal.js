import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router";
import { db } from "../config/firebase";

import { StoreContext } from "../contexts/StoreContext";

import { storageCart } from "../data/storageNames";

import ACTIONS from "../reducers/Actions";

const Modal = ({ open, toClose, children, order }) => {
  const storeContext = useContext(StoreContext);
  const history = useHistory();
  if (!open) {
    return null;
  }

  async function toAccept() {
    function getFormattedDate() {
      var date = new Date();
      var str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();

      return str;
    }

    await db.collection("orders").doc(getFormattedDate()).set(order);
    window.localStorage.removeItem(storageCart);
    storeContext.dispatch({ type: ACTIONS.CART_ITEMS_NUMBER });
    history.push("/");
  }

  return ReactDOM.createPortal(
    <>
      <div className="modal-wrapper"></div>
      <div className="modal">
        <button className="modal__button-close" onClick={toClose}>
          Close
        </button>
        {children}
        <div className="modal__buttons-controller">
          <button onClick={() => toAccept()}>Yes</button>
          <button>Cancel</button>
        </div>
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default Modal;

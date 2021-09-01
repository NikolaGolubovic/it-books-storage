import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";

import Modal from "./Modal";

import { db } from "../config/firebase";

import { StoreContext } from "../contexts/StoreContext";

const Order = () => {
  const storeContext = useContext(StoreContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const history = useHistory();

  const { order } = storeContext;

  useEffect(() => {
    if (order) {
      setOrderItems(order.items);
    }
    const fetchData = async () => {
      try {
        const data = await db
          .collection("users")
          .doc(storeContext.currentUser)
          .get();
        setFullName(data.data().fullName);
        setPhone(data.data().phone);
        setCity(data.data().city);
        setStreet(data.data().street);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  function toConfirm() {
    setModalOpen(true);
  }

  return (
    <div className="order-container">
      <table className="table-order">
        <th>Cover</th>
        <th>Title</th>
        <th>Price</th>
        <th>Number of copies</th>
        {orderItems.map((order) => {
          return (
            <tr className="order-list">
              <td>
                <img src={order.image} alt={order.title} />
              </td>
              <td>
                <p>{order.title}</p>
              </td>
              <td>
                <p>{order.price} $</p>
              </td>
              <td>
                <p>{order.copies}</p>
              </td>
            </tr>
          );
        })}
      </table>
      <div className="credentials order">
        <form>
          <label>
            Full Name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label>
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            Street
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
          </label>
          <label>
            Phone
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
        </form>
      </div>
      <h2>Total price: {order?.totalPrice}$</h2>
      <button onClick={toConfirm}>Confirm Order</button>
      <Modal
        open={modalOpen}
        toClose={() => setModalOpen(false)}
        order={{
          fullName,
          city,
          street,
          phone,
          title: orderItems.map((order) => {
            return { title: order.title, copies: order.copies };
          }),
        }}
      >
        <h2>Are you sure?</h2>
      </Modal>
    </div>
  );
};

export default Order;

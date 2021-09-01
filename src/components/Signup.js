import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { StoreContext } from "../contexts/StoreContext";
import { db } from "../config/firebase";

const Signup = () => {
  const auth = useContext(StoreContext);

  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const passwordConfirmRef = React.useRef();
  const fullNameRef = React.useRef();
  const cityRef = React.useRef();
  const streetRef = React.useRef();
  const mobileRef = React.useRef();

  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      console.log("Pass do not match");
    }

    try {
      auth.signup(emailRef.current.value, passwordRef.current.value);
      db.collection("users").doc(emailRef.current.value).set({
        fullName: fullNameRef.current.value,
        street: streetRef.current.value,
        phone: mobileRef.current.value,
        city: cityRef.current.value,
      });
      history.push("/");
    } catch (err) {
      console.log("Failed to create an account");
    }
  }
  return (
    <div className="credentials">
      <h2 className="text-center mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" ref={emailRef} />
        </label>

        <label>
          Password
          <input type="password" ref={passwordRef} required />
        </label>

        <label>
          Password Confirmation
          <input type="password" ref={passwordConfirmRef} required />
        </label>

        <label>
          Full Name
          <input type="text" ref={fullNameRef} required />
        </label>
        <label>
          City
          <input type="text" ref={cityRef} required />
        </label>
        <label>
          Street
          <input type="text" ref={streetRef} required />
        </label>
        <label>
          Phone
          <input type="text" ref={mobileRef} required />
        </label>
        <button>Register</button>
      </form>
      <hr />

      <div>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default Signup;

import React, { useContext } from "react";

import { Link, useHistory } from "react-router-dom";
import { StoreContext } from "../contexts/StoreContext";

const Signup = () => {
  const auth = useContext(StoreContext);
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await auth.login(emailRef.current.value, passwordRef.current.value);
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
        <button>Log in</button>
      </form>

      <div className="w-100 text-center mt-2">
        Already have an account? Log In <Link to="/login">Log In</Link>
      </div>
    </div>
  );
};

export default Signup;

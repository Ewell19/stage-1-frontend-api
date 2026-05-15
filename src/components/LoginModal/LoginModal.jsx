import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, onSubmit, onSwitchToRegister }) => {
  const [errorField, setErrorField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setErrorField("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setErrorField("");
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorField("email");
      setErrorMessage("Invalid email address");
      return;
    }

    if (password.trim().length < 2) {
      setErrorField("password");
      setErrorMessage("Invalid password");
      return;
    }

    if (onSubmit) {
      const result = await onSubmit({ email, password });

      if (result && result.ok === false) {
        setErrorField(result.field || "email");
        setErrorMessage(result.error || "Invalid username or password");
      }
    }
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Sign in"
      onClose={onClose}
      onSubmit={handleSubmit}
      modalClassName="login-modal"
      formClassName="login-modal__form"
    >
      <div className="modal__field">
        <label className="modal__label" htmlFor="login-email">
          Email
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          placeholder="Enter email"
          className={`modal__input modal__input--underline ${errorField === "email" ? "modal__input--error" : ""}`.trim()}
          required
        />
        {errorField === "email" && errorMessage && (
          <p className="modal__field-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="modal__field">
        <label className="modal__label" htmlFor="login-password">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          placeholder="Enter password"
          className={`modal__input modal__input--underline ${errorField === "password" ? "modal__input--error" : ""}`.trim()}
          required
        />
        {errorField === "password" && errorMessage && (
          <p className="modal__field-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <button type="submit" className="modal__submit modal__submit--gray">
        Sign in
      </button>
      <p className="modal__switch">
        or{" "}
        <button
          type="button"
          className="modal__switch-link"
          onClick={onSwitchToRegister}
        >
          Sign up
        </button>
      </p>
    </ModalWithForm>
  );
};

export default LoginModal;

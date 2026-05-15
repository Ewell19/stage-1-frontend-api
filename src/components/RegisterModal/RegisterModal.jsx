import React, { useEffect, useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

const RegisterModal = ({ isOpen, onClose, onSubmit, onSignIn }) => {
  const [view, setView] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState("");

  useEffect(() => {
    if (isOpen) {
      setView("form");
      setErrorMessage("");
      setErrorField("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    setErrorMessage("");
    setErrorField("");

    if (!/^[A-Za-z0-9._-]{2,30}$/.test(username.trim())) {
      setErrorMessage("Invalid Username.");
      setErrorField("username");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Enter a valid email.");
      setErrorField("email");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setErrorMessage("Password must be 8 to 20 characters long");
      setErrorField("password");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password must include at least 1 uppercase letter");
      setErrorField("password");
      return;
    }

    if (!(/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password))) {
      setErrorMessage(
        "Password must include at least 1 number or special character",
      );
      setErrorField("password");
      return;
    }

    const result = onSubmit
      ? await onSubmit({ username, email, password })
      : { ok: true };

    if (result && result.ok === false) {
      setErrorMessage(result.error || "This name is already taken");
      setErrorField(result.field || "username");
      return;
    }

    setView("success");
  };

  const handleSignInClick = () => {
    if (onSignIn) {
      onSignIn();
    }
  };

  if (view === "success") {
    return (
      <ModalWithForm
        isOpen={isOpen}
        title=""
        onClose={onClose}
        modalClassName="register-modal register-modal--success"
        formClassName="register-modal__success"
        hideHeader
      >
        <div className="register-modal__success-copy">
          <h2 className="register-modal__success-title">
            Registration successfully completed!
          </h2>
          <button
            type="button"
            className="register-modal__success-link"
            onClick={handleSignInClick}
          >
            Sign In
          </button>
        </div>
      </ModalWithForm>
    );
  }

  return (
    <ModalWithForm
      isOpen={isOpen}
      title="Sign up"
      onClose={onClose}
      onSubmit={handleSubmit}
      modalClassName="register-modal"
      formClassName="register-modal__form"
    >
      <div className="register-modal__field">
        <label className="modal__label" htmlFor="register-email">
          Email
        </label>
        <input
          type="text"
          id="register-email"
          name="email"
          placeholder="Enter email"
          className={`modal__input modal__input--underline ${errorField === "email" ? "modal__input--error" : ""}`.trim()}
          required
        />
        {errorField === "email" && errorMessage && (
          <p className="register-modal__error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="register-modal__field">
        <label className="modal__label" htmlFor="register-password">
          Password
        </label>
        <input
          type="password"
          id="register-password"
          name="password"
          placeholder="Enter password"
          className={`modal__input modal__input--underline ${errorField === "password" ? "modal__input--error" : ""}`.trim()}
          required
        />
        {errorField === "password" && errorMessage && (
          <p className="register-modal__error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="register-modal__field">
        <label className="modal__label" htmlFor="register-username">
          Username
        </label>
        <input
          type="text"
          id="register-username"
          name="username"
          placeholder="Enter your username"
          className={`modal__input modal__input--underline ${errorField === "username" ? "modal__input--error" : ""}`.trim()}
          required
        />
        {errorField === "username" && errorMessage && (
          <p className="register-modal__error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
      <div className="register-modal__actions">
        <button type="submit" className="modal__submit">
          Sign up
        </button>
      </div>
      <p className="register-modal__switch">
        or{" "}
        <button
          type="button"
          className="register-modal__signin"
          onClick={() => {
            handleSignInClick();
          }}
        >
          Sign in
        </button>
      </p>
    </ModalWithForm>
  );
};

export default RegisterModal;

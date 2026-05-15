import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li className="navigation__item">
          <Link to="/" className="navigation__link">
            Home
          </Link>
        </li>
        <li className="navigation__item">
          <Link to="/saved-news" className="navigation__link">
            Saved News
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

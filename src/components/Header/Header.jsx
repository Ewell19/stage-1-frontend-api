import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import bellIcon from "../../images/icons/Bell.svg";
import userIcon from "../../images/icons/User.svg";

const USERS_STORAGE_KEY = "newsExplorerUsers";

const loadUsers = () => {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return rawUsers ? JSON.parse(rawUsers) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const Header = ({
  profilePhoto,
  onProfilePhotoChange,
  isProfileOpen,
  onOpenProfile,
  onCloseProfile,
  user,
  onUserChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSavedPage = location.pathname === "/saved-news";
  const activeTab = location.pathname === "/saved-news" ? "saved" : "home";
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!location.state?.openAuth || user) {
      return;
    }

    setIsLoginOpen(true);
    setMobileMenuOpen(false);

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, user]);

  const handleSignUp = () => {
    setIsRegisterOpen(true);
    setMobileMenuOpen(false);
  };

  const handleTabClick = () => {
    setMobileMenuOpen(false);
  };

  const handleSignUpSubmit = async (data) => {
    console.log("Register:", data);
    const users = loadUsers();
    const normalizedName = normalizeValue(data.username);
    const normalizedEmail = normalizeValue(data.email);

    if (!/^[A-Za-z0-9._-]{2,30}$/.test(data.username.trim())) {
      return {
        ok: false,
        field: "username",
        error: "Invalid Username.",
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return {
        ok: false,
        field: "email",
        error: "Enter a valid email.",
      };
    }

    if (data.password.length < 8 || data.password.length > 20) {
      return {
        ok: false,
        field: "password",
        error: "Password must be 8 to 20 characters long",
      };
    }

    if (!/[A-Z]/.test(data.password)) {
      return {
        ok: false,
        field: "password",
        error: "Password must include at least 1 uppercase letter",
      };
    }

    if (!(/[0-9]/.test(data.password) || /[^A-Za-z0-9]/.test(data.password))) {
      return {
        ok: false,
        field: "password",
        error: "Password must include at least 1 number or special character",
      };
    }

    if (normalizedName === "player one") {
      return {
        ok: false,
        field: "username",
        error: "This username has been taken.",
      };
    }

    if (
      users.some((item) => normalizeValue(item.username) === normalizedName)
    ) {
      return {
        ok: false,
        field: "username",
        error: "This username has been taken.",
      };
    }

    if (users.some((item) => normalizeValue(item.email) === normalizedEmail)) {
      return {
        ok: false,
        field: "email",
        error: "This email has been taken.",
      };
    }

    saveUsers([
      ...users,
      {
        username: data.username.trim(),
        email: normalizedEmail,
        password: data.password,
      },
    ]);

    onUserChange({ name: data.username.trim(), email: normalizedEmail });
    return { ok: true };
  };

  const handleLoginSubmit = (data) => {
    console.log("Login:", data);

    const users = loadUsers();
    const normalizedEmail = normalizeValue(data.email);
    const matchedUser = users.find(
      (item) => normalizeValue(item.email) === normalizedEmail,
    );

    if (!matchedUser) {
      return {
        ok: false,
        field: "password",
        error: "Invalid password",
      };
    }

    if (matchedUser.password !== data.password) {
      return {
        ok: false,
        field: "password",
        error: "Invalid password",
      };
    }

    onUserChange({
      name: matchedUser.username || data.email.split("@")[0] || "User",
      email: normalizeValue(matchedUser.email || data.email),
    });
    setIsLoginOpen(false);
    return { ok: true };
  };

  const handleLogout = () => {
    onUserChange(null);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`header ${isSavedPage ? "header--saved" : "header--overlay"} ${mobileMenuOpen && !user ? "header--mobile-guest-open" : ""}`}
      >
        <div className="header__container">
          <Link to="/" className="header__logo">
            NewsExplorer
          </Link>

          <nav className="header__nav">
            <Link
              to="/"
              className={`header__tab ${activeTab === "home" ? "header__tab--active" : ""}`}
              onClick={handleTabClick}
            >
              Home
            </Link>
            {user && (
              <Link
                to="/saved-news"
                className={`header__tab ${activeTab === "saved" ? "header__tab--active" : ""}`}
                onClick={handleTabClick}
              >
                Saved articles
              </Link>
            )}
          </nav>

          {!user ? (
            <button
              className="header__signin"
              onClick={() => {
                setIsLoginOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              Sign in
            </button>
          ) : (
            <div className="header__user">
              <button
                className="header__user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="header__user-name">{user.name}</span>
                <svg
                  className="header__user-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10.5 3H14.25C14.6478 3 15.0294 3.15804 15.3107 3.43934C15.592 3.72064 15.75 4.10218 15.75 4.5V13.5C15.75 13.8978 15.592 14.2794 15.3107 14.5607C15.0294 14.842 14.6478 15 14.25 15H10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.5 12L4.5 9L7.5 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 9H12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {userMenuOpen && (
                <div className="header__user-menu">
                  <button
                    className="header__user-menu-item"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenProfile();
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="header__user-menu-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className={`header__hamburger ${mobileMenuOpen ? "header__hamburger--open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="header__hamburger-line"></span>
            <span className="header__hamburger-line"></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            className={`header__mobile-menu ${!user ? "header__mobile-menu--guest" : ""}`}
          >
            <Link
              to="/"
              className={`header__mobile-tab ${activeTab === "home" ? "header__mobile-tab--active" : ""}`}
              onClick={handleTabClick}
            >
              Home
            </Link>
            {user && (
              <Link
                to="/saved-news"
                className={`header__mobile-tab ${activeTab === "saved" ? "header__mobile-tab--active" : ""}`}
                onClick={handleTabClick}
              >
                Saved articles
              </Link>
            )}
            {!user && (
              <button
                className="header__mobile-signin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
              >
                Sign in
              </button>
            )}
            {user && (
              <>
                <button
                  className="header__mobile-tab"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                >
                  Profile
                </button>
                <button
                  className="header__mobile-tab"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </header>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={onCloseProfile}
        profilePhoto={profilePhoto}
        onPhotoChange={onProfilePhotoChange}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLoginSubmit}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleSignUpSubmit}
        onSignIn={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;

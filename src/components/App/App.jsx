import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import SavedNews from "../../pages/SavedNews";
import "./App.css";

const CURRENT_USER_STORAGE_KEY = "newsExplorerCurrentUser";

const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getProfilePhotoKey = (user) =>
  user?.email ? `profilePhoto:${normalizeValue(user.email)}` : null;

const loadStoredUser = () => {
  try {
    const rawUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!rawUser) return null;

    const parsedUser = JSON.parse(rawUser);
    if (!parsedUser?.email) return null;

    return {
      name: parsedUser.name || parsedUser.email.split("@")[0] || "User",
      email: normalizeValue(parsedUser.email),
    };
  } catch {
    return null;
  }
};

const App = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(loadStoredUser);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    const profilePhotoKey = getProfilePhotoKey(user);

    if (!profilePhotoKey) {
      setProfilePhoto(null);
      return;
    }

    setProfilePhoto(localStorage.getItem(profilePhotoKey) || null);
  }, [user]);

  const handleProfilePhotoChange = (nextPhoto) => {
    setProfilePhoto(nextPhoto);

    const profilePhotoKey = getProfilePhotoKey(user);
    if (!profilePhotoKey) return;

    if (nextPhoto) {
      localStorage.setItem(profilePhotoKey, nextPhoto);
    } else {
      localStorage.removeItem(profilePhotoKey);
    }
  };

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header
                  profilePhoto={profilePhoto}
                  onProfilePhotoChange={handleProfilePhotoChange}
                  isProfileOpen={isProfileOpen}
                  onOpenProfile={() => setIsProfileOpen(true)}
                  onCloseProfile={() => setIsProfileOpen(false)}
                  user={user}
                  onUserChange={setUser}
                />
                <Main
                  profilePhoto={profilePhoto}
                  onEditPhoto={() => setIsProfileOpen(true)}
                  user={user}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/saved-news"
            element={
              user ? (
                <>
                  <Header
                    profilePhoto={profilePhoto}
                    onProfilePhotoChange={handleProfilePhotoChange}
                    isProfileOpen={isProfileOpen}
                    onOpenProfile={() => setIsProfileOpen(true)}
                    onCloseProfile={() => setIsProfileOpen(false)}
                    user={user}
                    onUserChange={setUser}
                  />
                  <SavedNews user={user} />
                  <Footer />
                </>
              ) : (
                <Navigate to="/" replace state={{ openAuth: true }} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

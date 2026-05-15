import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import SavedNews from "../../pages/SavedNews";
import { AUTH_TOKEN_KEY, checkToken } from "../../utils/auth";
import "./App.css";

const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getProfilePhotoKey = (user) =>
  user?.email ? `profilePhoto:${normalizeValue(user.email)}` : null;

const App = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const bootstrapUser = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const result = await checkToken(token);
        if (!isCancelled) {
          setUser(result.data);
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        if (!isCancelled) {
          setUser(null);
        }
      }
    };

    bootstrapUser();

    return () => {
      isCancelled = true;
    };
  }, []);

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

import React, { useState, useRef, useEffect } from "react";
import "./Main.css";
import About from "../About/About";
import NewsCardList from "../NewsCardList/NewsCardList";
import Preloader from "../Preloader/Preloader";
import { fetchNews } from "../../utils/api";
import {
  getSavedArticles,
  saveArticle,
  removeArticle,
} from "../../utils/savedArticles";
import notFoundIcon from "../../images/not-found.svg";

const Main = ({ profilePhoto, onEditPhoto, user }) => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle | loading | done | error | empty
  const [savedUrls, setSavedUrls] = useState([]);
  const resultsRef = useRef(null);

  // Load saved articles when user changes
  useEffect(() => {
    if (user?.email) {
      const saved = getSavedArticles(user.email);
      setSavedUrls(saved.map((a) => a.url));
    } else {
      setSavedUrls([]);
    }
  }, [user]);

  const handleSaveArticle = (article) => {
    if (!user?.email) return;
    saveArticle(user.email, {
      ...article,
      keyword: query.trim() || article.keyword || "General",
    });
    setSavedUrls((prev) => [...prev, article.url]);
  };

  const handleRemoveArticle = (articleUrl) => {
    if (!user?.email) return;
    removeArticle(user.email, articleUrl);
    setSavedUrls((prev) => prev.filter((url) => url !== articleUrl));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSearchStatus("loading");
    setArticles([]);

    try {
      const results = await fetchNews(trimmed);
      setArticles(results);
      setSearchStatus(results.length === 0 ? "empty" : "done");
      if (results.length > 0) {
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    } catch (err) {
      console.error(err);
      setSearchStatus("error");
    }
  };

  return (
    <main className="main">
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1 className="hero__title">What&rsquo;s going on in the world?</h1>
          <p className="hero__subtitle">
            Find the latest news on any topic and save them in your personal
            account.
          </p>
          <form className="hero__search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hero__input"
              placeholder="Enter topic"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="hero__search-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      {searchStatus === "loading" && (
        <div ref={resultsRef} className="search-status search-status--loading">
          <Preloader />
        </div>
      )}

      {searchStatus === "error" && (
        <div ref={resultsRef} className="search-status search-status--error">
          <p className="search-status__text">
            Sorry, something went wrong. Please try again.
          </p>
        </div>
      )}

      {searchStatus === "empty" && (
        <div ref={resultsRef} className="search-status search-status--empty">
          <img
            src={notFoundIcon}
            alt="Nothing found"
            className="search-status__icon"
          />
          <p className="search-status__title">Nothing found</p>
          <p className="search-status__text">
            Sorry, but nothing matches your search terms.
          </p>
        </div>
      )}

      {searchStatus === "done" && articles.length > 0 && (
        <div ref={resultsRef}>
          <NewsCardList
            articles={articles}
            isLoggedIn={!!user}
            savedUrls={savedUrls}
            onSaveArticle={handleSaveArticle}
            onRemoveArticle={handleRemoveArticle}
          />
        </div>
      )}

      <About
        profilePhoto={profilePhoto}
        onEditPhoto={onEditPhoto}
        user={user}
      />
    </main>
  );
};

export default Main;

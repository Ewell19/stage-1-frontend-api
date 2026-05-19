import React, { useState, useRef, useEffect } from "react";
import "./Main.css";
import About from "../About/About";
import NewsCardList from "../NewsCardList/NewsCardList";
import Preloader from "../Preloader/Preloader";
import {
  fetchNews,
  getSavedArticles,
  removeArticle,
  saveArticle,
} from "../../utils/api";
import notFoundIcon from "../../images/not-found.svg";

const Main = ({ profilePhoto, onEditPhoto, user }) => {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle | loading | done | error | empty
  const [savedUrls, setSavedUrls] = useState([]);
  const resultsRef = useRef(null);

  // Load saved articles when user changes
  useEffect(() => {
    let isCancelled = false;

    const loadSavedUrls = async () => {
      if (!user?.email) {
        setSavedUrls([]);
        return;
      }

      try {
        const saved = await getSavedArticles(user.email);
        if (!isCancelled) {
          setSavedUrls(saved.map((article) => article.url));
        }
      } catch {
        if (!isCancelled) {
          setSavedUrls([]);
        }
      }
    };

    loadSavedUrls();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleSaveArticle = async (article) => {
    if (!user?.email) return;

    try {
      await saveArticle(user.email, {
        ...article,
        keyword: query.trim() || article.keyword || "General",
      });
      setSavedUrls((prev) => [...prev, article.url]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveArticle = async (articleUrl) => {
    if (!user?.email) return;

    try {
      await removeArticle(user.email, articleUrl);
      setSavedUrls((prev) => prev.filter((url) => url !== articleUrl));
    } catch (error) {
      console.error(error);
    }
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

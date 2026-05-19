import React, { useState, useEffect } from "react";
import Preloader from "../components/Preloader/Preloader";
import "../styles/SavedNews.css";
import { getSavedArticles, removeArticle } from "../utils/api";
import trashIcon from "../images/trash.svg";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const SavedNews = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const articleCount = articles.length;
  const keywords = [
    ...new Set(articles.map((article) => article.keyword).filter(Boolean)),
  ];

  const keywordsSummary = (() => {
    if (keywords.length === 0) return "No keywords yet";
    if (keywords.length === 1) return keywords[0];
    if (keywords.length === 2) return `${keywords[0]} and ${keywords[1]}`;
    return `${keywords[0]}, ${keywords[1]}, and ${keywords.length - 2} other`;
  })();

  useEffect(() => {
    let isCancelled = false;

    const loadSavedArticles = async () => {
      if (!user?.email) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const saved = await getSavedArticles(user.email);
        if (!isCancelled) {
          setArticles(saved);
        }
      } catch {
        if (!isCancelled) {
          setArticles([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSavedArticles();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const handleRemoveArticle = async (articleUrl) => {
    if (!user?.email) return;

    try {
      await removeArticle(user.email, articleUrl);
      setArticles((prev) =>
        prev.filter((article) => article.url !== articleUrl),
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="saved-news">
        <Preloader />
      </main>
    );
  }

  if (articles.length === 0) {
    return (
      <main className="saved-news">
        <section className="saved-news__lead">
          <p className="saved-news__breadcrumb">Saved articles</p>
          <h1 className="saved-news__title">
            {user.name}, you have 0 saved articles
          </h1>
          <p className="saved-news__keywords">By keywords: None yet</p>
        </section>
        <section className="saved-news__results saved-news__results--empty" />
      </main>
    );
  }

  return (
    <main className="saved-news">
      <section className="saved-news__lead">
        <p className="saved-news__breadcrumb">Saved articles</p>
        <h1 className="saved-news__title">
          {user.name}, you have {articleCount} saved{" "}
          {articleCount === 1 ? "article" : "articles"}
        </h1>
        <p className="saved-news__keywords">
          By keywords: <span>{keywordsSummary}</span>
        </p>
      </section>

      <section className="saved-news__results">
        <div className="saved-news__grid">
          {articles.map((article) => (
            <article
              key={
                article.url ||
                `${article.title || "article"}-${article.publishedAt || "unknown-date"}`
              }
              className="saved-news__card"
            >
              <div className="saved-news__image-wrap">
                <img
                  src={
                    article.urlToImage ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={article.title}
                  className="saved-news__image"
                />
                <span className="saved-news__keyword-chip">
                  {article.keyword || "General"}
                </span>
                <button
                  type="button"
                  className="saved-news__remove-btn"
                  aria-label="Remove from saved"
                  onClick={() => handleRemoveArticle(article.url)}
                >
                  <img src={trashIcon} alt="" aria-hidden="true" />
                </button>
              </div>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="saved-news__link"
              >
                <div className="saved-news__content">
                  <p className="saved-news__date">
                    {formatDate(article.publishedAt)}
                  </p>
                  <h2 className="saved-news__card-title">{article.title}</h2>
                  <p className="saved-news__description">
                    {article.description}
                  </p>
                  <p className="saved-news__source">{article.source?.name}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default SavedNews;

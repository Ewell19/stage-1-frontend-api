import React from "react";
import "./NewsCard.css";

const BookmarkIcon = ({ saved, isLoggedIn, onSave }) => (
  <div className="news-card__bookmark-wrapper">
    {!isLoggedIn && (
      <span className="news-card__bookmark-tooltip">
        Sign in to save articles
      </span>
    )}
    <button
      type="button"
      className={`news-card__bookmark ${saved ? "news-card__bookmark--saved" : ""}`}
      aria-label={saved ? "Remove from saved" : "Save article"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSave?.();
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 3h8a1 1 0 0 1 1 1v12l-5-3-5 3V4a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={saved ? "currentColor" : "none"}
        />
      </svg>
    </button>
  </div>
);

const NewsCard = ({
  title,
  description,
  image,
  url,
  date,
  source,
  isSaved = false,
  isLoggedIn = false,
  onSave = () => {},
}) => {
  return (
    <article className="news-card">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="news-card__link"
      >
        <div className="news-card__image-wrapper">
          {image ? (
            <img src={image} alt={title} className="news-card__image" />
          ) : (
            <div className="news-card__image-placeholder" />
          )}
        </div>
        <div className="news-card__content">
          {date && <p className="news-card__date">{date}</p>}
          <h3 className="news-card__title">{title}</h3>
          <p className="news-card__description">{description}</p>
          {source && <p className="news-card__source">{source}</p>}
        </div>
      </a>
      <BookmarkIcon saved={isSaved} isLoggedIn={isLoggedIn} onSave={onSave} />
    </article>
  );
};

export default NewsCard;

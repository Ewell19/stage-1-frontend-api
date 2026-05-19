import React, { useState } from "react";
import NewsCard from "../NewsCard/NewsCard";
import "./NewsCardList.css";

const PAGE_SIZE = 3;

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const NewsCardList = ({
  articles,
  isLoggedIn,
  savedUrls = [],
  onSaveArticle,
  onRemoveArticle,
}) => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const handleShowMore = () => setVisible((prev) => prev + PAGE_SIZE);

  return (
    <section className="news-card-list">
      <h2 className="news-card-list__heading">Search results</h2>
      <div className="news-card-list__grid">
        {articles.slice(0, visible).map((article, i) => {
          const isSaved = savedUrls.includes(article.url);
          return (
            <NewsCard
              key={article.url || i}
              title={article.title}
              description={article.description}
              image={article.urlToImage}
              url={article.url}
              date={formatDate(article.publishedAt)}
              source={article.source?.name}
              isSaved={isSaved}
              isLoggedIn={isLoggedIn}
              onSave={() => {
                if (isSaved) {
                  onRemoveArticle?.(article.url);
                } else {
                  onSaveArticle?.(article);
                }
              }}
            />
          );
        })}
      </div>
      {visible < articles.length && (
        <div className="news-card-list__show-more">
          <button
            className="news-card-list__show-more-btn"
            onClick={handleShowMore}
          >
            Show more
          </button>
        </div>
      )}
    </section>
  );
};

export default NewsCardList;

const NEWS_API_KEY = "b55a0841501d490fa7bce66ccbdb1461";
const NEWS_API_BASE = "https://newsapi.org/v2/everything";
const SAVED_ARTICLES_KEY = "newsExplorerSavedArticles";
const NETWORK_DELAY_MS = 220;

// API utility functions for fetching news data
export const fetchNews = async (query) => {
  const url = `${NEWS_API_BASE}?q=${encodeURIComponent(query)}&pageSize=100&apiKey=${NEWS_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NewsAPI error: ${response.status}`);
  }
  const data = await response.json();
  return data.articles || [];
};

const delay = (ms = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const readSavedArticles = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeSavedArticles = (allSavedArticles) => {
  localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(allSavedArticles));
};

export const getSavedArticles = async (userEmail) => {
  await delay();

  if (!userEmail) {
    return [];
  }

  const allSavedArticles = readSavedArticles();
  return allSavedArticles[normalizeValue(userEmail)] || [];
};

export const saveArticle = async (userEmail, article) => {
  await delay();

  if (!userEmail) {
    throw new Error("Authorization required");
  }

  const normalizedEmail = normalizeValue(userEmail);
  const allSavedArticles = readSavedArticles();
  const userArticles = allSavedArticles[normalizedEmail] || [];

  const alreadySaved = userArticles.find(
    (savedArticle) => savedArticle.url === article.url,
  );

  if (alreadySaved) {
    return alreadySaved;
  }

  const nextArticle = {
    _id: `fake-article-${Date.now().toString(36)}`,
    ...article,
    savedAt: new Date().toISOString(),
  };

  allSavedArticles[normalizedEmail] = [nextArticle, ...userArticles];
  writeSavedArticles(allSavedArticles);
  return nextArticle;
};

export const removeArticle = async (userEmail, articleUrl) => {
  await delay();

  if (!userEmail) {
    throw new Error("Authorization required");
  }

  const normalizedEmail = normalizeValue(userEmail);
  const allSavedArticles = readSavedArticles();
  const userArticles = allSavedArticles[normalizedEmail] || [];

  allSavedArticles[normalizedEmail] = userArticles.filter(
    (savedArticle) => savedArticle.url !== articleUrl,
  );

  writeSavedArticles(allSavedArticles);

  return {
    message: "Article deleted",
    url: articleUrl,
  };
};

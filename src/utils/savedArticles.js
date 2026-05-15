// Saved articles localStorage management

const SAVED_ARTICLES_KEY = "newsExplorerSavedArticles";

// Get all saved articles for a user
export const getSavedArticles = (userEmail) => {
  if (!userEmail) return [];
  const allSaved = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}");
  return allSaved[userEmail] || [];
};

// Save an article for a user
export const saveArticle = (userEmail, article) => {
  if (!userEmail) return;
  const allSaved = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}");
  if (!allSaved[userEmail]) {
    allSaved[userEmail] = [];
  }

  // Avoid duplicates by checking URL
  const exists = allSaved[userEmail].some((a) => a.url === article.url);
  if (!exists) {
    allSaved[userEmail].push({
      ...article,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(allSaved));
  }
};

// Remove a saved article for a user
export const removeArticle = (userEmail, articleUrl) => {
  if (!userEmail) return;
  const allSaved = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}");
  if (allSaved[userEmail]) {
    allSaved[userEmail] = allSaved[userEmail].filter(
      (a) => a.url !== articleUrl,
    );
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(allSaved));
  }
};

// Check if an article is saved for a user
export const isArticleSaved = (userEmail, articleUrl) => {
  if (!userEmail) return false;
  const saved = getSavedArticles(userEmail);
  return saved.some((a) => a.url === articleUrl);
};

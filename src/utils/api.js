const NEWS_API_KEY = "b55a0841501d490fa7bce66ccbdb1461";
const NEWS_API_BASE = "https://newsapi.org/v2/everything";

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

export const saveArticle = async (article) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving article:", error);
    throw error;
  }
};

export const getSavedArticles = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/saved");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    throw error;
  }
};

const USERS_STORAGE_KEY = "newsExplorerUsers";
const SESSIONS_STORAGE_KEY = "newsExplorerAuthSessions";
export const AUTH_TOKEN_KEY = "newsExplorerToken";

const NETWORK_DELAY_MS = 220;

const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const delay = (ms = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const readUsers = () => {
  try {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return rawUsers ? JSON.parse(rawUsers) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const readSessions = () => {
  try {
    const rawSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return rawSessions ? JSON.parse(rawSessions) : {};
  } catch {
    return {};
  }
};

const writeSessions = (sessions) => {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
};

const createToken = (email) =>
  `fake-token-${normalizeValue(email)}-${Date.now().toString(36)}`;

const buildAuthError = (message, field = "email") => {
  const error = new Error(message);
  error.field = field;
  return error;
};

export const register = async ({ name, email, password }) => {
  await delay();

  const normalizedEmail = normalizeValue(email);
  const trimmedName = String(name || "").trim();
  const users = readUsers();

  if (!trimmedName) {
    throw buildAuthError("Name is required", "username");
  }

  if (users.some((user) => normalizeValue(user.email) === normalizedEmail)) {
    throw buildAuthError("This email has been taken.", "email");
  }

  if (
    users.some(
      (user) => normalizeValue(user.name) === normalizeValue(trimmedName),
    )
  ) {
    throw buildAuthError("This username has been taken.", "username");
  }

  const nextUser = {
    _id: `fake-user-${Date.now().toString(36)}`,
    name: trimmedName,
    email: normalizedEmail,
    password,
  };

  writeUsers([...users, nextUser]);

  const token = createToken(normalizedEmail);
  const sessions = readSessions();
  sessions[token] = normalizedEmail;
  writeSessions(sessions);
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return {
    token,
    data: {
      _id: nextUser._id,
      name: nextUser.name,
      email: nextUser.email,
    },
  };
};

export const authorize = async (email, password) => {
  await delay();

  const normalizedEmail = normalizeValue(email);
  const users = readUsers();

  const matchedUser = users.find(
    (user) => normalizeValue(user.email) === normalizedEmail,
  );

  if (!matchedUser || matchedUser.password !== password) {
    throw buildAuthError("Invalid email or password", "password");
  }

  const token = createToken(normalizedEmail);
  const sessions = readSessions();
  sessions[token] = normalizedEmail;
  writeSessions(sessions);
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  return {
    token,
    data: {
      _id: matchedUser._id || `fake-user-${normalizedEmail}`,
      name: matchedUser.name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
    },
  };
};

export const checkToken = async (token) => {
  await delay(120);

  if (!token) {
    throw buildAuthError("Authorization required");
  }

  const sessions = readSessions();
  const userEmail = sessions[token];

  if (!userEmail) {
    throw buildAuthError("Token is invalid");
  }

  const users = readUsers();
  const matchedUser = users.find(
    (user) => normalizeValue(user.email) === normalizeValue(userEmail),
  );

  if (!matchedUser) {
    throw buildAuthError("User not found");
  }

  return {
    data: {
      _id: matchedUser._id || `fake-user-${normalizeValue(matchedUser.email)}`,
      name: matchedUser.name || matchedUser.email.split("@")[0],
      email: normalizeValue(matchedUser.email),
    },
  };
};

export const signOut = async () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    const sessions = readSessions();
    delete sessions[token];
    writeSessions(sessions);
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  await delay(80);
  return { ok: true };
};

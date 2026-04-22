import api from "../api";

const unwrapApiData = (response) => response?.data?.data ?? response?.data ?? response;

const unwrapEntity = (payload) => payload?.content ?? payload;

const normalizeUser = (user) => {
  if (!user) return null;

  const role = user.role === "ADMINISTRATOR" ? "ADMIN" : user.role;

  return {
    id: user.id ?? user.userId,
    userId: user.userId ?? user.id,
    username:
      user.username ??
      user.fullName ??
      user.name ??
      (user.email ? user.email.split("@")[0] : "User"),
    fullName: user.fullName ?? user.username ?? user.name ?? "",
    email: user.email ?? "",
    role,
  };
};

export const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return normalizeUser(unwrapEntity(unwrapApiData(response)));
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return normalizeUser(unwrapEntity(unwrapApiData(response)));
};

export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    const users = unwrapApiData(response);
    return Array.isArray(users) ? users.map(normalizeUser).filter(Boolean) : [];
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      const currentUser = await getCurrentUser();
      return currentUser ? [currentUser] : [];
    }
    throw error;
  }
};

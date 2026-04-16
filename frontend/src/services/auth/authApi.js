import axiosClient from "../../api/axiosClient";

/**
 * All API calls for authentication.
 * Each function returns the inner `data` field from ApiResponse wrapper
 * so callers get { token, userId, email, fullName, role } directly.
 */

// POST /api/users/register
export const registerUser = async ({ fullName, email, password, role = "STUDENT" }) => {
  const response = await axiosClient.post("/api/users/register", {
    fullName,
    email,
    password,
    role,
  });
  return response.data.data;
};

// POST /api/users/login
export const loginUser = async ({ email, password }) => {
  const response = await axiosClient.post("/api/users/login", {
    email,
    password,
  });
  return response.data.data;
};

// GET /api/users/me
export const fetchCurrentUser = async () => {
  const response = await axiosClient.get("/api/users/me");
  return response.data.data;
};

// PUT /api/users/me - Update current user profile
export const updateMyProfile = async (updateData) => {
  const response = await axiosClient.put("/api/users/me", updateData);
  return response.data.data;
};

export const initiateGoogleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

export const initiateGitHubLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/github";
};
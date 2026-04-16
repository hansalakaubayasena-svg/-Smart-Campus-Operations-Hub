import axiosClient from "../../api/axiosClient";

/**
 * User profile API — operations on the currently authenticated user's own account.
 * Distinct from adminApi.js which handles ADMIN-level operations on other users.
 */

// PUT /api/users/me — update own profile (name, email, optional password)
export const updateProfile = async ({
  fullName,
  email,
  currentPassword,
  newPassword,
}) => {
  const payload = { fullName, email };
  if (newPassword) {
    payload.currentPassword = currentPassword;
    payload.newPassword = newPassword;
  }
  const response = await axiosClient.put("/api/users/me", payload);
  // returns EntityModel<AuthResponse> — Spring HATEOAS flattens fields into the object
  return response.data.data;
};

// DELETE /api/users/me — permanently delete own account
// password is required for manual accounts; pass undefined for Google-only accounts
export const deleteMyAccount = async (password) => {
  await axiosClient.delete("/api/users/me", {
    data: { password: password || null },
  });
};
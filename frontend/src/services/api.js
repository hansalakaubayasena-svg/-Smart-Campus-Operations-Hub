import axiosClient from "../api/axiosClient";

const withApiPrefix = (url) => {
  if (!url) return "/api";
  if (url.startsWith("/api/") || url === "/api") return url;
  return `/api${url.startsWith("/") ? url : `/${url}`}`;
};

const api = {
  get: (url, config) => axiosClient.get(withApiPrefix(url), config),
  post: (url, data, config) => axiosClient.post(withApiPrefix(url), data, config),
  put: (url, data, config) => axiosClient.put(withApiPrefix(url), data, config),
  patch: (url, data, config) => axiosClient.patch(withApiPrefix(url), data, config),
  delete: (url, config) => axiosClient.delete(withApiPrefix(url), config),
};

export default api;

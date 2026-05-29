import { apiClient } from "./axios";

export async function apiRequest(path, options = {}) {
  try {
    const response = await apiClient({
      url: path,
      method: options.method || "GET",
      params: options.params,
      data:
        options.data ?? (options.body ? JSON.parse(options.body) : undefined),
      headers: options.headers,
    });
    return response.data;
  } catch (error) {
    let message = "Request failed";

    if (error.response) {
      message = error.response.data?.message || "Request failed";
    } else if (error.code === "ECONNABORTED") {
      message = "Request timed out. Please try again.";
    } else if (error.request) {
      message = "No response from server. Please check your connection.";
    } else {
      message = error.message || "Request failed";
    }

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.data = error.response?.data;

    throw normalizedError;
  }
}

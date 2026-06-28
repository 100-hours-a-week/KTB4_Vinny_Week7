const API_BASE_URL = "http://localhost:8080";

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "요청에 실패했습니다.");
  }

  const apiResponse = await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "요청에 실패했습니다.");
  }
  return apiResponse.data; 
}
const API_BASE_URL = "http://localhost:8080";

export async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "요청에 실패했습니다.");
  }

  if (response.status === 204) {
    return;
  }

  const apiResponse = await response.json();

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "요청에 실패했습니다.");
  }
  return apiResponse.data; 
}

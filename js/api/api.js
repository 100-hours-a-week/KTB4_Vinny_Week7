const API_BASE_URL = "http://localhost:8080";

export async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = hasBody && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
    
  const isAuthRequired = path !== "/login" && path !== "/sign-up";

  if (isAuthRequired) {
    const authData = localStorage.getItem("auth");
    
    if (!authData) {
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = "./login.html";
      throw new Error("인증 정보가 없습니다.");
    }

    try {
      const auth = JSON.parse(authData);
      const token = auth?.accessToken;
      
      if (!token) {
        throw new Error("토큰이 존재하지 않습니다.");
      }

      headers.set("Authorization", `Bearer ${token}`);
    } catch (e) {
      localStorage.removeItem("auth");
      window.location.href = "./login.html";
      throw new Error("유효하지 않은 인증 정보입니다.");
    }
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

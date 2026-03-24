const TOKEN_KEY = "jwt_token";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      removeToken();
      return false;
    }
    return true;
  } catch {
    removeToken();
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
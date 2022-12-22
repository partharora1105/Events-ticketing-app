export function getJWT() {
  return localStorage.getItem("token");
}

export function setJWT(newToken) {
  return localStorage.setItem("token", newToken);
}

export function deleteJWT() {
  localStorage.removeItem("token");
}
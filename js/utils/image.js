import { API_BASE_URL } from "../api/api.js";

/**
 * @param {string} imageUrl
 * @returns {string}
 */

export function getFullImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (typeof imageUrl !== "string") return "";
  
  if (imageUrl.startsWith("http")) return imageUrl;
  
  if (imageUrl.startsWith("/")) return `${API_BASE_URL}${imageUrl}`;
  
  return imageUrl;
}

/**
 * @param {HTMLElement} element
 * @param {string} imageUrl
 */

export function setBackgroundImage(element, imageUrl) {
  if (!element || !imageUrl) return;
  
  const fullUrl = getFullImageUrl(imageUrl);
  if (fullUrl) {
    element.style.backgroundImage = `url("${fullUrl}")`;
    element.style.backgroundPosition = "center";
    element.style.backgroundSize = "cover";
  }
}

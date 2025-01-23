const API_BASE_URL = import.meta.env.VITE_API_RAIL_WAY;
const API_KEY = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;
const TOTAL_USERS_API = import.meta.env.VITE_TOTAL_USERS_API;

if (!API_BASE_URL || !API_KEY || !token) {
  throw new Error("Missing API environment variables");
}

export { API_BASE_URL, API_KEY, token, TOTAL_USERS_API };

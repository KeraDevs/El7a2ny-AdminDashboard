const API_BASE_URL = process.env.NEXT_PUBLIC_API_RAIL_WAY;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const TOTAL_USERS_API = process.env.NEXT_PUBLIC_API_RAIL_WAY;

if (!API_BASE_URL || !API_KEY) {
  throw new Error("Missing API environment variables");
}

export { API_BASE_URL, API_KEY, TOTAL_USERS_API };

// Thin fetch wrapper around the Vanrang Foundation API.
// Base URL comes from REACT_APP_API_BASE_URL (see .env / .env.production).
// Every endpoint returns { success, data, message } or { success:false, message, errors:[] }
// per the shared API contract — this wrapper unwraps that envelope and throws
// a normalized ApiError on failure so callers can just try/catch.

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/v1";

const UPLOAD_URL = process.env.REACT_APP_API_UPLOAD_URL || "";


export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors || [];
  }
}

function getToken() {
  return localStorage.getItem("vf_token");
}

async function request(path, { method = "GET", body, isForm = false, auth = true } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError("Network error — please check your connection and try again.", { status: 0 });
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    // no body / non-JSON response
  }

  if (!res.ok || !json || json.success === false) {
    const message = (json && json.message) || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, errors: (json && json.errors) || [] });
  }

  return json.data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  // For multipart/form-data uploads (banners, gallery, team, blogs, etc.)
  postForm: (path, formData, opts) => request(path, { ...opts, method: "POST", body: formData, isForm: true }),
  putForm: (path, formData, opts) => request(path, { ...opts, method: "PUT", body: formData, isForm: true }),
};

export { getToken, BASE_URL, UPLOAD_URL };

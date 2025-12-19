import crypto from "crypto";

export default function handler(req, res) {
  const baseUrl =
    process.env.APP_BASE_URL ||
    `https://${req.headers.host}`;

  const redirectUri = `${baseUrl}/api/google-callback`;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "Missing GOOGLE_CLIENT_ID" });
  }

  // CSRF protection via state
  const state = crypto.randomBytes(16).toString("hex");

  // Starter scopes (safe defaults; expand later as needed)
  const scope = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    scope,
    state,
  });

  // Store state in a short-lived cookie
  res.setHeader(
    "Set-Cookie",
    `g_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  // Redirect to Google consent screen
  res.status(302).setHeader("Location", authUrl).end();
}

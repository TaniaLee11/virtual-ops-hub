export default async function handler(req, res) {
  const baseUrl =
    process.env.APP_BASE_URL ||
    `https://${req.headers.host}`;

  const redirectUri = `${baseUrl}/api/google-callback`;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET",
    });
  }

  const { code, state } = req.query || {};

  // Verify state (CSRF protection)
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/(?:^|;\s*)g_state=([^;]+)/);
  const expectedState = match?.[1];

  if (!state || !expectedState || state !== expectedState) {
    return res.status(400).json({
      error: "Invalid state. Please retry Connect Google.",
    });
  }

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code." });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: String(code),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokenRes.ok) {
    return res.status(500).json({
      error: "Token exchange failed",
      details: tokens,
    });
  }

  // Clear state cookie
  res.setHeader("Set-Cookie", [
    "g_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
  ]);

  /**
   * Temporary proof-of-flow:
   * This returns tokens in the browser so we can confirm OAuth works.
   * Next step will be storing tokens server-side (Vercel KV) and
   * updating /api/status to show google:true.
   */
  return res.status(200).json({
    ok: true,
    tokens_received: true,
    tokens,
  });
}

export default {
  async fetch(request, env) {
    // 1. Set up CORS headers so index.html can talk to this worker
    const headers = {
      "Access-Control-Allow-Origin": "*", // Replace with your github.io URL in production
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Handle preflight CORS check
    if (request.method === "OPTIONS") return new Response(null, { headers });

    // 2. Only accept POST requests containing the auth code
    if (request.method === "POST") {
      const { code } = await request.json();

      // 3. Exchange code for access_token with GitHub
      const response = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code: code
        })
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), { headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};

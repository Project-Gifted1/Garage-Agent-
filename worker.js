export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Smartcar OAuth Token Exchange Route
    if (url.pathname === '/oauth/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response(JSON.stringify({ error: 'Missing auth code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const tokenResponse = await fetch('https://auth.smartcar.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(env.SMARTCAR_CLIENT_ID + ':' + env.SMARTCAR_CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: env.SMARTCAR_REDIRECT_URI
        })
      });

      const tokenData = await tokenResponse.json();
      return new Response(JSON.stringify(tokenData), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default API Status Response
    return new Response(JSON.stringify({ message: "Garage Agent Worker Active" }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

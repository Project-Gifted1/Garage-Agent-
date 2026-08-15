export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Smartcar Login Route
    if (url.pathname === '/login') {
      const clientId = env.SMARTCAR_CLIENT_ID || 'client_01M005QGMRN80T4W3Q6MCFEK14';
      const redirectUri = env.SMARTCAR_REDIRECT_URI || 'https://garage-agent-api.gnfcw9w5rk.workers.dev/oauth/callback';
      const scope = encodeURIComponent('required:read_vehicle_info required:read_odometer required:read_location');
      
      const authUrl = `https://connect.smartcar.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
      return Response.redirect(authUrl, 302);
    }

    // 2. Smartcar OAuth Token Exchange Route
    if (url.pathname === '/oauth/callback') {
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response(JSON.stringify({ error: 'Missing auth code' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const clientId = env.SMARTCAR_CLIENT_ID || 'client_01M005QGMRN80T4W3Q6MCFEK14';
      const redirectUri = env.SMARTCAR_REDIRECT_URI || 'https://garage-agent-api.gnfcw9w5rk.workers.dev/oauth/callback';

      const tokenResponse = await fetch('https://auth.smartcar.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + env.SMARTCAR_CLIENT_SECRET)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri
        })
      });

      const tokenData = await tokenResponse.json();
      return new Response(JSON.stringify(tokenData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. Default Response
    return new Response(JSON.stringify({ message: "Garage Agent Worker Active" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

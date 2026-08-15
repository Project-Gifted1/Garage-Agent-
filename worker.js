export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Dynamic CORS Headers to allow your GitHub Pages site
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://project-gifted1.github.io',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route 1: Exchange Smartcar Auth Code for Access Token
    if (url.pathname === '/exchange-code' && request.method === 'POST') {
      try {
        const { code } = await request.json();
        const client_id = env.SMARTCAR_CLIENT_ID || 'b29a00b0-21d3-46d3-b942-6be8e474ce04';
        const client_secret = env.SMARTCAR_CLIENT_SECRET;

        const auth = btoa(`${client_id}:${client_secret}`);
        const tokenResponse = await fetch('https://auth.smartcar.com/oauth/token', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://project-gifted1.github.io/Garage-Agent-/'
          })
        });

        const data = await tokenResponse.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Route 2: Fetch Active DTCs
    if (url.pathname === '/get-dtcs' && request.method === 'POST') {
      try {
        const { accessToken, vehicleId } = await request.json();

        const dtcResponse = await fetch(`https://api.smartcar.com/v2.0/vehicles/${vehicleId}/dtcs`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const dtcData = await dtcResponse.json();
        return new Response(JSON.stringify(dtcData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Default 404 Response
    return new Response(JSON.stringify({ message: 'Garage Agent Worker Active' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

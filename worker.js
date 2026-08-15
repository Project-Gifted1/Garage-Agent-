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

    const clientId = env.SMARTCAR_CLIENT_ID || 'b29a00b0-21d3-46d3-b942-6be8e474ce04';
    const redirectUri = env.SMARTCAR_REDIRECT_URI || 'https://garage-agent-api.gnfcw9w5rk.workers.dev/oauth/callback';

    // 1. Smartcar Login Route (Live Mode)
    if (url.pathname === '/login') {
      const authUrl = `https://connect.smartcar.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read_vehicle_info+read_odometer+read_location&mode=live`;
      return Response.redirect(authUrl, 302);
    }

    // 2. OAuth Callback: Token Exchange & Initial Vehicle Data Fetch
    if (url.pathname === '/oauth/callback') {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');

      if (error) {
        return new Response(JSON.stringify({ status: 'error', error: error }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (!code) {
        return new Response(JSON.stringify({ status: 'error', message: 'Missing auth code' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      try {
        // Step A: Exchange Auth Code for Access Token
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

        if (!tokenResponse.ok) {
          return new Response(JSON.stringify({ status: 'token_exchange_failed', details: tokenData }), {
            status: tokenResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const accessToken = tokenData.access_token;

        // Step B: Get List of Vehicles
        const vehiclesResponse = await fetch('https://api.smartcar.com/v2.0/vehicles', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const vehiclesData = await vehiclesResponse.json();

        if (!vehiclesResponse.ok || !vehiclesData.vehicles || vehiclesData.vehicles.length === 0) {
          return new Response(JSON.stringify({ status: 'no_vehicles_found', tokens: tokenData, vehicles_response: vehiclesData }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const vehicleId = vehiclesData.vehicles[0];

        // Step C: Fetch Vehicle Attributes & Odometer
        const [infoRes, odoRes] = await Promise.all([
          fetch(`https://api.smartcar.com/v2.0/vehicles/${vehicleId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          fetch(`https://api.smartcar.com/v2.0/vehicles/${vehicleId}/odometer`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);

        const info = await infoRes.json();
        const odometer = await odoRes.json();

        // Step D: Output complete success payload
        return new Response(JSON.stringify({
          status: 'success',
          vehicle_id: vehicleId,
          vehicle_info: info,
          odometer: odometer,
          tokens: tokenData
        }, null, 2), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (err) {
        return new Response(JSON.stringify({ status: 'server_error', message: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Default route
    return new Response(JSON.stringify({ message: "Garage Agent Worker Active" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const PORT = process.env.AUTH_SETUP_PORT;

const REDIRECT_URI = `http://localhost:${PORT}/callback`;

if (!CLIENT_ID) {
    console.error("Spotify client ID is not defined.");
    process.exit(1);
  }

const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played'
];

const params = new URLSearchParams({
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: scopes.join(' '),
});

const AUTH_URL = `https://accounts.spotify.com/authorize?${params.toString()}`;

console.log(AUTH_URL);

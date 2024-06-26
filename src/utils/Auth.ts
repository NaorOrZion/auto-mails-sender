// auth.ts
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = '721700191832-1si8gdbp4f7pkmsugs85r2v8t4umd2hv.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';
const REDIRECT_URI = window.location.origin;

interface DecodedToken {
  exp: number;
}

export function getAuthUrl() {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}`;
  return authUrl;
}

export function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.hash.replace('#', ''));
  return params.get('access_token');
}

export function isTokenValid(token: string) {
  // Check if token is valid
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

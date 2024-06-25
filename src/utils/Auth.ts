// auth.ts
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = '332259366157-1r3pt7kjt24jcjs7ojbrjbmh69gkpd7a.apps.googleusercontent.com';
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
  const decoded = jwtDecode<DecodedToken>(token);
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
}

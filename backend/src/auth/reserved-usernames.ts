// Path segments used by the frontend router or backend API. A username that
// collided with one of these would be unreachable at {BASE_URL}/{username}/{code}
// or would shadow an app route, so they are blocked at registration time.
export const RESERVED_USERNAMES = new Set([
  'api',
  'auth',
  'login',
  'register',
  'logout',
  'generate',
  'states',
  'categories',
  'public',
  'admin',
  'assets',
  'static',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  'about',
  'terms',
  'privacy',
  'help',
  'support',
  'settings',
  'me',
  'user',
  'users',
]);

const API_URL = (() => {
  return process.env.NODE_ENV === 'production'
    ? 'https://travel.unli.xyz/api'
    : 'http://localhost:3005';
})();

export default API_URL;

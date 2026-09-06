// Explicit public origin supports HTTPS proxies that rewrite the upstream Host.
export function publicOrigin(value) {
  if (!value) return null;
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('PUBLIC_ORIGIN must be an HTTP(S) origin, without a path or credentials.');
  }
  return url.origin;
}

export function allowedOrigin(headers, configuredOrigin) {
  if (!headers.origin) return true; // Native clients do not send a browser Origin.
  try {
    const origin = new URL(headers.origin);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.origin !== headers.origin) return false;
    return configuredOrigin ? origin.origin === configuredOrigin : origin.host === headers.host;
  } catch { return false; }
}

export function proxyHops(value = '0') {
  if (!/^\d+$/.test(value) || Number(value) > 5) throw new Error('TRUST_PROXY_HOPS must be an integer from 0 to 5.');
  return Number(value);
}

export function clientAddress(request, trustedHops = 0) {
  const direct = request.socket.remoteAddress || 'unknown';
  if (!trustedHops) return direct;
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded !== 'string') return direct;
  const chain = [...forwarded.split(',').map(ip => ip.trim()).filter(Boolean), direct];
  return chain[Math.max(0, chain.length - 1 - trustedHops)];
}

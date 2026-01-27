'use strict';

exports.handler = async (event) => {
  const path = event.path || '';

  const route = path
    .replace(/^\/.netlify\/functions\/mock/, '')
    .replace(/^\/api/, '');

  const matchesPrefix = (value, prefix) =>
    value === prefix || value.startsWith(`${prefix}/`);

  if (matchesPrefix(route, '/500')) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }

  if (matchesPrefix(route, '/503')) {
    return {
      statusCode: 503,
      headers: { 'Retry-After': '120' },
      body: 'Service Unavailable',
    };
  }

  if (matchesPrefix(route, '/502')) {
    return { statusCode: 502, body: 'Bad Gateway' };
  }

  if (matchesPrefix(route, '/504')) {
    return { statusCode: 504, body: 'Gateway Timeout' };
  }

  if (matchesPrefix(route, '/timeout')) {
    await new Promise((r) => setTimeout(r, 120_000));
    return { statusCode: 200, body: 'Late OK' };
  }

  if (matchesPrefix(route, '/drop')) {
    return { statusCode: 444, body: '' };
  }

  return { statusCode: 200, body: 'OK' };
};

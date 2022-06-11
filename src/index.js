import apolloHandler from './handlers/apolloHandler';
import setHeaders from './utils/setHeaders';

// Define request handler
const handleRequest = async (request) => {
  const { origin } = new URL(request.url);
  switch (request.method) {
    case 'GET':
      return setHeaders(new Response(null, {
        headers: {
          Location: `https://studio.apollographql.com/sandbox?endpoint=${origin}`,
        },
        status: 301,
      }));
    case 'OPTIONS':
      return setHeaders(new Response(null, { status: 200 }));
    case 'POST':
      return setHeaders(await apolloHandler(request));
    default:
      return setHeaders(new Response(`Method ${request.method} not supported`, { status: 405 }));
  }
}


// attach handler to fetch event
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});


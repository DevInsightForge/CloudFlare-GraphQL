import apolloHandler from './handlers/apolloHandler';
import setCors from './utils/setCors';

// Define request handler
const handleRequest = async (request) => {
  const { origin } = new URL(request.url);
  switch (request.method) {
    case 'GET':
      return setCors(new Response('', {
        // redirect to the GraphQL playground
        headers: {
          Location: `https://studio.apollographql.com/sandbox?endpoint=${origin}`,
        },
        status: 301,
      }));
    case 'OPTIONS':
      return setCors(new Response('', { status: 200 }));
    case 'POST':
      return setCors(await apolloHandler(request));
    default:
      return setCors(new Response(`Method ${method} not supported`, { status: 405 }));
  }
}


// attach handler to fetch event
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});


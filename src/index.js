import apolloHandler from './handlers/apolloHandler';
import setCors from './utils/setCors';

// Define request handler
const handleRequest = async (request) => {
  if (request.method === 'OPTIONS') {
    return setCors(new Response('', { status: 200 }));
  }
  else if (request.method === 'POST') {
    return setCors(await apolloHandler(request));
  }
  else {
    return setCors(new Response(`Method ${request.method} not supported`, { status: 405 }));
  }

}


// attach handler to fetch event
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});


const setCorsHeaders = (response) => {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    response.headers.set('Access-Control-Allow-Methods', 'POST');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('X-Content-Type-Options', 'nosniff');

    return response;
}

export default setCorsHeaders
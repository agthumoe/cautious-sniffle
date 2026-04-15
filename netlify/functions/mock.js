/**
 * Mock Skipcart Server for Testing (Netlify Function)
 * 
 * This server simulates various Skipcart API response scenarios for testing purposes.
 * 
 * Endpoints:
 *   GET  /health              - Health check
 *   POST /quote               - Mock quote endpoint
 *   POST /delivery            - Mock create delivery endpoint
 * 
 * Query Parameters to control behavior:
 *   ?scenario=fast_1s         - Response in 1 second
 *   ?scenario=fast_2s         - Response in 2 seconds
 *   ?scenario=fast_3s         - Response in 3 seconds
 *   ?scenario=fast_4s         - Response in 4 seconds
 *   ?scenario=slow_5s         - Response in 5 seconds
 *   ?scenario=slow_10s        - Response in 10 seconds
 *   ?scenario=timeout         - No response (simulates 30s timeout)
 *   ?scenario=error_500       - Internal Server Error
 *   ?scenario=error_504       - Gateway Timeout
 *   ?scenario=error_502       - Bad Gateway
 *   ?scenario=error_503       - Service Unavailable
 *   ?scenario=error_400       - Bad Request
 *   ?scenario=error_401       - Unauthorized
 *   ?scenario=error_403       - Forbidden
 *   ?scenario=error_404       - Not Found
 *   ?scenario=error_429       - Too Many Requests
 *   ?scenario=invalid_json    - Returns invalid JSON
 *   ?scenario=empty_response  - Returns empty response
 *   ?scenario=html_response   - Returns HTML instead of JSON
 * 
 * Default: fast_1s (success response in 1 second)
 */

'use strict';

// Global scenario - can be changed via API or env variable
let GLOBAL_SCENARIO = process.env.MOCK_SCENARIO || 'fast_1s';

// Mock successful quote response
const mockQuoteResponse = {
    id: 'mock-quote-id-' + Date.now(),
    fee: 599,
    currency: 'USD',
    duration: 25,
    expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    pickup_eta: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    dropoff_eta: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    provider: 'skipcart'
};

// Mock successful delivery response
const mockDeliveryResponse = {
    id: 'mock-delivery-id-' + Date.now(),
    status: 'pending',
    tracking_url: 'https://mock-tracking.skipcart.com/track/mock-id',
    fee: 599,
    currency: 'USD',
    pickup_eta: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    dropoff_eta: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    provider: 'skipcart'
};

// Error responses
const errorResponses = {
    error_400: { statusCode: 400, body: { error: 'Bad Request', message: 'Invalid request parameters', code: 'INVALID_REQUEST' } },
    error_401: { statusCode: 401, body: { error: 'Unauthorized', message: 'Invalid or missing authentication token', code: 'UNAUTHORIZED' } },
    error_403: { statusCode: 403, body: { error: 'Forbidden', message: 'Access denied', code: 'FORBIDDEN' } },
    error_404: { statusCode: 404, body: { error: 'Not Found', message: 'Resource not found', code: 'NOT_FOUND' } },
    error_429: { statusCode: 429, body: { error: 'Too Many Requests', message: 'Rate limit exceeded', code: 'RATE_LIMITED' } },
    error_500: { statusCode: 500, body: { error: 'Internal Server Error', message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' } },
    error_502: { statusCode: 502, body: { error: 'Bad Gateway', message: 'Upstream server error', code: 'BAD_GATEWAY' } },
    error_503: { statusCode: 503, body: { error: 'Service Unavailable', message: 'Service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' } },
    error_504: { statusCode: 504, body: { error: 'Gateway Timeout', message: 'Upstream server timeout', code: 'GATEWAY_TIMEOUT' } },
};

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse scenario from query string, fallback to global scenario
const getScenario = (queryParams) => {
    return queryParams.scenario || GLOBAL_SCENARIO;
};

// Get delay time based on scenario
const getDelayTime = (scenario) => {
    const delayMap = {
        'fast_1s': 1000,
        'fast_2s': 2000,
        'fast_3s': 3000,
        'fast_4s': 4000,
        'slow_5s': 5000,
        'slow_6s': 6000,
        'slow_10s': 10000,
        'slow_15s': 15000,
        'slow_20s': 20000,
        'timeout': 35000, // Longer than typical 30s timeout
    };
    return delayMap[scenario] || 1000;
};

// Handle request
const handleRequest = async (queryParams, isQuote) => {
    const scenario = getScenario(queryParams);
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[${new Date().toISOString()}] [${requestId}] Scenario: ${scenario}`);

    // Handle different scenarios
    switch (scenario) {
        case 'timeout':
            console.log(`[${requestId}] Simulating timeout (35s delay, no response)...`);
            await delay(35000);
            // Don't send response - let client timeout
            return {
                statusCode: 200,
                body: ''
            };

        case 'invalid_json':
            console.log(`[${requestId}] Returning invalid JSON`);
            await delay(500);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: '{invalid json response: missing quotes and brackets'
            };

        case 'empty_response':
            console.log(`[${requestId}] Returning empty response`);
            await delay(500);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: ''
            };

        case 'html_response':
            console.log(`[${requestId}] Returning HTML instead of JSON`);
            await delay(500);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'text/html' },
                body: '<html><body><h1>Error: Service Unavailable</h1><p>Please try again later.</p></body></html>'
            };

        case 'error_400':
        case 'error_401':
        case 'error_403':
        case 'error_404':
        case 'error_429':
        case 'error_500':
        case 'error_502':
        case 'error_503':
        case 'error_504':
            const errorConfig = errorResponses[scenario];
            console.log(`[${requestId}] Returning ${scenario} error`);
            await delay(500);
            return {
                statusCode: errorConfig.statusCode,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorConfig.body)
            };

        default:
            // Success scenarios with delay
            const delayTime = getDelayTime(scenario);
            console.log(`[${requestId}] Delaying ${delayTime}ms before success response`);
            await delay(delayTime);
            
            const response = isQuote ? { ...mockQuoteResponse, id: `quote-${requestId}` } : { ...mockDeliveryResponse, id: `delivery-${requestId}` };
            
            console.log(`[${requestId}] Returning success response`);
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response)
            };
    }
};

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    const path = event.path || '';
    const queryParams = event.queryStringParameters || {};

    // Remove Netlify function prefix
    const route = path
        .replace(/^\/.netlify\/functions\/mock/, '')
        .replace(/^\/api/, '');

    console.log(`[${new Date().toISOString()}] ${event.httpMethod} ${path} -> ${route}`);

    // Health check
    if (route === '/health' || route === '/') {
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status: 'ok', 
                service: 'mock-skipcart-server', 
                currentScenario: GLOBAL_SCENARIO, 
                timestamp: new Date().toISOString() 
            })
        };
    }

    // Change scenario via API - GET /set-scenario?scenario=error_500
    if (route === '/set-scenario') {
        const newScenario = queryParams.scenario;
        if (newScenario) {
            const oldScenario = GLOBAL_SCENARIO;
            GLOBAL_SCENARIO = newScenario;
            console.log(`[${new Date().toISOString()}] Scenario changed: ${oldScenario} -> ${GLOBAL_SCENARIO}`);
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    success: true, 
                    message: `Scenario changed from '${oldScenario}' to '${GLOBAL_SCENARIO}'`,
                    currentScenario: GLOBAL_SCENARIO 
                })
            };
        } else {
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    currentScenario: GLOBAL_SCENARIO,
                    availableScenarios: [
                        'fast_1s', 'fast_2s', 'fast_3s', 'fast_4s',
                        'slow_5s', 'slow_6s', 'slow_10s', 'slow_15s', 'slow_20s',
                        'timeout', 'error_400', 'error_401', 'error_403', 'error_404',
                        'error_429', 'error_500', 'error_502', 'error_503', 'error_504',
                        'invalid_json', 'empty_response', 'html_response'
                    ]
                })
            };
        }
    }

    // Quote endpoint (supports both /quote and /Quote for Skipcart)
    if (route === '/quote' || route === '/Quote' || route === '/api/quote' || route.includes('/estimates')) {
        const result = await handleRequest(queryParams, true);
        return {
            ...result,
            headers: { ...headers, ...result.headers }
        };
    }

    // Delivery endpoint
    if (route === '/delivery' || route === '/api/delivery' || route.includes('/deliveries')) {
        const result = await handleRequest(queryParams, false);
        return {
            ...result,
            headers: { ...headers, ...result.headers }
        };
    }

    // Skipcart Auth endpoint - /auth2/User (matches actual Skipcart API)
    if (route === '/auth2/User' || route === '/V1api/auth2/User') {
        const scenario = getScenario(queryParams);
        const requestId = `auth-${Date.now()}`;
        console.log(`[${new Date().toISOString()}] [${requestId}] AUTH Request - Scenario: ${scenario}`);

        // Handle error scenarios
        if (scenario.startsWith('error_')) {
            const errorConfig = errorResponses[scenario];
            await delay(500);
            return {
                statusCode: errorConfig.statusCode,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(errorConfig.body)
            };
        }

        // Handle special scenarios
        if (scenario === 'invalid_json') {
            await delay(500);
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: '{invalid json auth response'
            };
        }

        if (scenario === 'timeout') {
            console.log(`[${requestId}] Simulating auth timeout...`);
            await delay(35000);
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }

        // Success response - matches Skipcart auth response format
        const delayTime = getDelayTime(scenario);
        await delay(delayTime);

        const authResponse = {
            Result: {
                UserToken: 'mock-user-token-' + Date.now(),
                RefreshToken: 'mock-refresh-token-' + Date.now(),
                UserId: 'mock-user-id-12345',
                TokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
                RefreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            },
            Success: true,
            Message: 'Authentication successful'
        };

        console.log(`[${requestId}] Returning auth success response`);
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(authResponse)
        };
    }

    // Skipcart Refresh Token endpoint
    if (route === '/auth2/RefreshToken' || route === '/V1api/auth2/RefreshToken') {
        const scenario = getScenario(queryParams);
        const requestId = `refresh-${Date.now()}`;
        console.log(`[${new Date().toISOString()}] [${requestId}] REFRESH TOKEN Request - Scenario: ${scenario}`);

        // Handle error scenarios
        if (scenario.startsWith('error_')) {
            const errorConfig = errorResponses[scenario];
            await delay(500);
            return {
                statusCode: errorConfig.statusCode,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(errorConfig.body)
            };
        }

        if (scenario === 'invalid_json') {
            await delay(500);
            return {
                statusCode: 200,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: '{invalid json refresh response'
            };
        }

        if (scenario === 'timeout') {
            console.log(`[${requestId}] Simulating refresh token timeout...`);
            await delay(35000);
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }

        // Success response
        const delayTime = getDelayTime(scenario);
        await delay(delayTime);

        const refreshResponse = {
            Result: {
                UserToken: 'mock-refreshed-token-' + Date.now(),
                RefreshToken: 'mock-new-refresh-token-' + Date.now(),
                UserId: 'mock-user-id-12345',
                TokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                RefreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            Success: true,
            Message: 'Token refreshed successfully'
        };

        console.log(`[${requestId}] Returning refresh token success response`);
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(refreshResponse)
        };
    }

    // Generic token endpoint (for other auth testing)
    if (route === '/token' || route === '/oauth/token' || route === '/api/token') {
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_token: 'mock-access-token-' + Date.now(),
                token_type: 'Bearer',
                expires_in: 3600
            })
        };
    }

    // 404 for unknown routes
    return {
        statusCode: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Not Found', message: `Unknown endpoint: ${route}` })
    };
};

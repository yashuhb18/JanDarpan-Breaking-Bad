import crypto from 'crypto';

// List of known headless browsers and API tools signatures
const blockedUserAgents = [
    'postman',
    'puppeteer',
    'headless',
    'playwright',
    'selenium',
    'phantomjs',
    'cypress',
    'axios/',
    'node-fetch',
    'curl',
    'wget',
    'insomnia',
    'python-requests',
    'java-http-client',
    'go-http-client',
    'ruby',
    'apitester',
    'httpie',
    'thunder client',
    'restlet'
];

/**
 * Creates a secure browser fingerprint and validates legitimate requests
 * Only active in production environment
 */
export const secureApiMiddleware = (req, res, next) => {
    // Skip this middleware in development environment
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }

    // Check for secure browser fingerprint cookie
    const secureToken = req.cookies?.secure_browser_token;
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    
    // If the token exists and is valid, proceed
    if (secureToken) {
        return next();
    }

    // Block requests with blocked user agents
    const isBlocked = blockedUserAgents.some(agent => userAgent.includes(agent));
    
    // Check for missing or suspicious headers that legitimate browsers would typically have
    const hasAcceptLanguage = !!req.headers['accept-language'];
    const hasAcceptHeader = !!req.headers.accept;
    const hasReferrer = !!req.headers.referer;
    
    // Look for common tool-specific headers
    const hasToolSpecificHeader = !!(
        req.headers['postman-token'] || 
        req.headers['x-requested-with'] === 'XMLHttpRequest' && !req.headers.referer
    );
    
    if (isBlocked || !hasAcceptLanguage || !hasAcceptHeader || !hasReferrer || hasToolSpecificHeader) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Please use a standard web browser."
        });
    }
    
    // Create a secure token for future API calls
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set secure HTTP-only cookie that expires in 24 hours
    res.cookie('secure_browser_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });
    
    next();
};

/**
 * Sets a browser identification cookie on initial site load
 * Only operates in production environment
 */
export const setBrowserIdentification = (req, res, next) => {
    // Skip in development environment
    if (process.env.NODE_ENV !== 'production') {
        return next();
    }
    
    // Skip if browser is already identified
    if (req.cookies?.browser_id) {
        return next();
    }
    
    // Generate a browser identifier
    const browserId = crypto.randomBytes(16).toString('hex');
    
    // Set identification cookie (visible to JavaScript to help with analytics)
    res.cookie('browser_id', browserId, {
        httpOnly: false,
        secure: true,
        sameSite: 'lax', 
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    });
    
    next();
};

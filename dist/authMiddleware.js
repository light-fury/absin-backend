"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractApiKey = void 0;
// Middleware to extract API key from the Authorization header
const extractApiKey = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is missing' });
    }
    const [authType, apiKey] = authHeader.split(' ');
    if (authType !== 'Bearer' || !apiKey) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }
    req.apiKey = apiKey; // Attach the API key to the request object
    next();
};
exports.extractApiKey = extractApiKey;

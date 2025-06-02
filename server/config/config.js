// Configuration settings for the email website server

const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        fromAddress: process.env.EMAIL_FROM || 'noreply@mymail.com'
    },
    security: {
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 100, // requests per window
        corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
        bcryptRounds: 12
    },
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
        version: 'v1'
    }
};

module.exports = config;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            // In a real application, you would verify the user exists in your database
            // For now, we'll just pass the payload through
            return done(null, jwt_payload);
        } catch (error) {
            return done(error, false);
        }
    }));
};

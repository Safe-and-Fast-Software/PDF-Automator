import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/secure-endpoint', passport.authenticate('oauth2', { session: false }), (req, res) => {
    res.send(`Hello ${req.user.name}, this is a secure endpoint.`);
});

export default router;

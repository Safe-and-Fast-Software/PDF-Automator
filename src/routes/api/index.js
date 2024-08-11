import express from 'express';

const router = express.Router();

router.get('/api', (request, responds) => {
    responds.send('This endpoint is public.');
});

export default router;

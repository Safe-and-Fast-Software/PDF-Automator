import express from 'express';

const apiRoutes = express.Router();

apiRoutes.get('/', (request, responds) => {
    responds.send('This endpoint is public.');
});

export default apiRoutes;

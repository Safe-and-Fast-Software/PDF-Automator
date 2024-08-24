import { Router } from "express";
import { personRepository } from '../om/person.js'

const userApiRoutes = Router();

userApiRoutes.put('/', async (req, res) => {
    const person = await personRepository.createAndSave(req.body)
    res.status(200).send(person)
  })

userApiRoutes.get('/all', (request, responds) => {
    responds.send('This endpoint is public.');
});

export default userApiRoutes;


import { Entity, Schema } from 'redis-om';
import client from '../client.js';

class CompanyContact extends Entity {};

const CompanyContactSchema = new Schema(CompanyContact, {
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'email' },
});

export const CompanyContactRepository = client.fetchRepository(CompanyContactSchema);
await CompanyContactRepository.createIndex();

import { Entity, Schema } from 'redis-om';
import client from '../client.js';

class Company extends Entity {};

const CompanySchema = new Schema(Company, {
  name: { type: 'string' },
});

export const CompanyRepository = client.fetchRepository(CompanySchema);
await CompanyRepository.createIndex();

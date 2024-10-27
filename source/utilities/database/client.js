import { createClient } from 'redis';

export const client = createClient({
  // username : process.env.REDIS_USERNAME,
  // password : process.env.REDIS_PASSWORD,
  socket : {
    host : process.env.REDIS_HOST, 
    port : process.env.REDIS_PORT
  }
});

client.on('error', (error) => console.error('Redis Client Error', error));

await client.connect();

export default client;

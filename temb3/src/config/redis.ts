import Redis from 'ioredis';
import environment from './environment';

const  redisClient  = {
  createClient(type?: string): Redis.Redis {
    switch (type) {
      case 'client':
      case 'subscriber':
      default:
        return new Redis(environment.REDIS_URL);
    }
  },
};

export default redisClient;

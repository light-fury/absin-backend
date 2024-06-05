import { PoolConfig } from 'pg';

export const poolConfig: PoolConfig = {
    connectionString: process.env.POSTGRES_URL,
};

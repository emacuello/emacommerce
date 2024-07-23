import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: '.env.development' });

const configDatabase = {
    type: 'postgres',
    url: process.env.DB_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    // synchronize: true,
    logging: true,
    // dropSchema: true,
    migrations: ['dist/migrations/*.{ts,js}'],
};

export default registerAs('database', () => configDatabase);

export const dbConfig = new DataSource(configDatabase as DataSourceOptions);

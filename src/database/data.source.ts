import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config({ path: '.env' });

export const dataSourseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  entities: [process.env.DB_ENTITIES],
  migrations: [process.env.DB_MIGRATIONS],
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
};

const dataSourse: DataSource = new DataSource(dataSourseOptions);
export default dataSourse;

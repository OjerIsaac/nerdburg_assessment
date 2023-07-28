import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const DB_HOST =
  configService.get('NODE_ENV') === 'test'
    ? configService.get('DB_HOST_TEST')
    : configService.get('DB_HOST');
const DB_USER =
  configService.get('NODE_ENV') === 'test'
    ? configService.get('DB_USER_TEST')
    : configService.get('DB_USER');
const DB_PASSWORD =
  configService.get('NODE_ENV') === 'test'
    ? configService.get('DB_PASSWORD_TEST')
    : configService.get('DB_PASSWORD');
const DB_NAME =
  configService.get('NODE_ENV') === 'test'
    ? configService.get('DB_NAME_TEST')
    : configService.get('DB_NAME');
const DB_PORT =
  configService.get('NODE_ENV') === 'test'
    ? configService.get('DB_PORT_TEST')
    : configService.get('DB_PORT');

export const options: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '/../**/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: false,
};

export default new DataSource(options);

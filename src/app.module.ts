import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { envVarsSchema } from './helpers';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { JWT_SECRET } from './base/constants';
import { UserModule } from './modules/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    DatabaseModule,
    UserModule,
    {
      ...JwtModule.register({
        secret: JWT_SECRET,
        signOptions: {},
      }),
      global: true,
    },
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

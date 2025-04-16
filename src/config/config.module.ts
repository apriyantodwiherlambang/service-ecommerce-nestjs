// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as EnvConfigModule } from '@nestjs/config';

@Module({
  imports: [EnvConfigModule.forRoot({ isGlobal: true })],
})
export class ConfigModule {}

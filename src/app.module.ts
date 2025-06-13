import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'), ChatModule],
})
export class AppModule { }
import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GraphQlResolver } from './resolver.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      playground: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public', 'icones'),
      serveRoot: '/icones',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GraphQlResolver],
})
export class AppModule {}

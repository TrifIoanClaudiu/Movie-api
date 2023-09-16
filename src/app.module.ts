import { Module } from "@nestjs/common";
import { MovieModule } from "./movie/movie.module";
import { GenreModule } from "./genre/genre.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("DATABASE_URL"),
      }),
    }),
    MovieModule,
    GenreModule,
  ],
})
export class AppModule {}

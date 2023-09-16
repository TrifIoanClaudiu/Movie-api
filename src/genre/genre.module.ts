import { Module } from "@nestjs/common";
import { GenreService } from "./genre.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GenreSchema } from "src/models/genre.schema";
import { GenreController } from "./genre.controller";
import { MovieSchema } from "src/models/movie.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Genre", schema: GenreSchema }]),
    MongooseModule.forFeature([{ name: "Movie", schema: MovieSchema }]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { GenreService } from "./genre.service";
import { Genre } from "src/models/genre.schema";

@Controller("genres")
export class GenreController {
  constructor(private genreService: GenreService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("create")
  createGenre(@Body() genre: Genre) {
    return this.genreService.createGenre(genre);
  }

  @HttpCode(HttpStatus.OK)
  @Get("/")
  getGenres() {
    return this.genreService.getAllGenres();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/:id")
  deleteGenre(@Param("id") id: string) {
    return this.genreService.deleteGenre(id);
  }
}

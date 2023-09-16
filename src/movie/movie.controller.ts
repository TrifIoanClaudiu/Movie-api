import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { MovieService } from "./movie.service";
import { Movie } from "src/models/movie.schema";

@Controller("movies")
export class MovieController {
  constructor(private movieService: MovieService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("create")
  createMovie(@Body() movie: Movie) {
    return this.movieService.createMovie(movie);
  }

  @HttpCode(HttpStatus.OK)
  @Get("/")
  getMovies(@Query() query: { page: number; limit: number }) {
    return this.movieService.getMovies(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get("/:id")
  getMovie(@Param("id") id: string) {
    return this.movieService.getMovie(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("/:id")
  deleteMovie(@Param("id") id: string) {
    return this.movieService.deleteMovie(id);
  }

  @HttpCode(HttpStatus.OK)
  @Put("/update/:id")
  updateMovie(@Param("id") id: string, @Body() movie: Movie) {
    return this.movieService.updateMovie(id, movie);
  }

  @HttpCode(HttpStatus.OK)
  @Post("/search/")
  searchMovies(@Query() searchQuery: { title?: string; genre?: string }) {
    return this.movieService.searchMovies(searchQuery);
  }
}

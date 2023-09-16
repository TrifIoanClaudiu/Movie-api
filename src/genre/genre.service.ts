import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Genre } from "src/models/genre.schema";
import { Movie } from "src/models/movie.schema";

@Injectable()
export class GenreService {
  constructor(
    @InjectModel("Genre") private readonly genreModel: Model<Genre>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>
  ) {}

  async createGenre(genre: Genre): Promise<Genre> {
    try {
      const newGenre = new this.genreModel(genre);
      return await newGenre.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        throw new HttpException(
          `Please provide a name`,
          HttpStatus.BAD_REQUEST
        );
      } else if (err.code === 11000) {
        throw new HttpException("Genre already exists", HttpStatus.CONFLICT);
      } else {
        throw err;
      }
    }
  }

  async getAllGenres(): Promise<Genre[]> {
    try {
      return this.genreModel.find();
    } catch (err) {
      throw err;
    }
  }

  async deleteGenre(id: string): Promise<string> {
    const genre = await this.genreModel.findById(id).exec();
    console.log("AAAA");
    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
    const moviesWithGenre = await this.movieModel
      .find({ genre: genre.name })
      .exec();
    for (const movie of moviesWithGenre) {
      movie.genre = movie.genre.filter((g) => g !== genre.name);
      await movie.save();
      await this.genreModel.findByIdAndDelete(id).exec();

      return `Genre with ID ${id} has been deleted, and it has been removed from related movies.`;
    }
  }
}

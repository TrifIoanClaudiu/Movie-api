import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Movie } from "src/models/movie.schema";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel("Movie") private readonly movieModel: Model<Movie>
  ) {}
  async createMovie(movie: Movie): Promise<Movie> {
    try {
      const newMovie = new this.movieModel(movie);
      return await newMovie.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        const missingFields = Object.keys(err.errors).join(", ");
        throw new HttpException(
          `All fields must be completed: ${missingFields}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw err;
      }
    }
  }

  async updateMovie(id: string, movieData: Partial<Movie>): Promise<Movie> {
    const updatedMovie = await this.movieModel
      .findByIdAndUpdate(id, movieData, { new: true })
      .exec();
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return updatedMovie;
  }

  async getMovies(query: { page: number; limit: number }): Promise<Movie[]> {
    try {
      const { page, limit } = query;
      const skip = (page - 1) * limit;
      const totalMovies = await this.movieModel.countDocuments();

      if (skip >= totalMovies) {
        throw new HttpException(
          "Requested page is too big; there are no more movies.",
          HttpStatus.BAD_REQUEST
        );
      }

      return this.movieModel.find().skip(skip).limit(limit).exec();
    } catch (err) {
      throw err;
    }
  }

  async getMovie(id: string): Promise<Movie> {
    try {
      const foundMovie = await this.movieModel.findById(id);

      if (!foundMovie) {
        throw new HttpException("Movie not found", HttpStatus.NOT_FOUND);
      }

      return foundMovie;
    } catch (err) {
      throw err;
    }
  }

  async deleteMovie(id: string): Promise<void> {
    try {
      const result = await this.movieModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
    } catch (err) {
      throw err;
    }
  }

  async searchMovies(query: {
    title?: string;
    genre?: string;
  }): Promise<Movie[]> {
    try {
      const { title, genre } = query;
      if (!(title || genre)) {
        throw new Error("Either title or genre must be provided");
      }

      const searchQuery: {
        title?: { $regex: string; $options: string };
        genre?: string;
      } = {};
      if (title) {
        searchQuery.title = { $regex: title, $options: "i" };
      }
      if (genre) {
        searchQuery.genre = genre;
      }

      return this.movieModel.find(searchQuery);
    } catch (err) {
      throw err;
    }
  }
}

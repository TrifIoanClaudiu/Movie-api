import { IsDate, IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose";

export const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: [String], required: true },
});

export class Movie {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  releaseDate: Date;

  @IsNotEmpty()
  genre: string[];
}

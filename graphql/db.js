import fetch from "node-fetch";
const API_URL = "https://yts.mx/api/v2/list_movies.json?";
import { movies } from "../schema/movie";
import { pipeline } from "stream";
const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

export const getMovies = () => {
  return movies.find({});
};

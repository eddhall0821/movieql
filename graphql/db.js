import fetch from "node-fetch";
const API_URL = "https://yts.mx/api/v2/list_movies.json?";
import { movies } from "../schema/movie";
import { files } from "../schema/file";
import { pipeline } from "stream";
const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

export const getMovies = () => {
  return movies.find({});
};

export const getFiles = () => {
  return files.find({});
};

import { getMovies, getUsers } from "./db";
import { movies } from "../schema/movie";
import { tests } from "../schema/test";
import { pipeline } from "stream";
const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

const resolvers = {
  Query: {
    movies: () => getMovies(),
    createtests: () => tests.createCollection().then(() => console.log("tt")),
  },
  Mutation: {
    addMovie: async (_, args) => {
      console.log(args);
      const movie = new movies({
        ...args.data,
      });
      const error = await movie.save();
      if (error) console.log(error);
      return movie;
    },

    deleteMovie: async (_, args) => {
      const msg = await movies.deleteOne({ id: args.data.id });
      console.log(msg);
      if (msg.deletedCount === 1) {
        return true;
      } else {
        return false;
      }
    },

    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;

      const stream = createReadStream();
      console.log(file);

      const out = createWriteStream(
        path.join(__dirname, "../images", filename)
      );
      stream.pipe(out);
      await finished(out);

      return true;
    },
  },
};

export default resolvers;

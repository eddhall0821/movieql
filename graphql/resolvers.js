import { getFiles, getMovies } from "./db";
import { movies } from "../schema/movie";
import { files } from "../schema/file";
const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

const resolvers = {
  Query: {
    files: () => files.find({}),
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

    addFile: async (_, args) => {
      console.log(args);
      const file = new files({
        ...args.data,
      });
      const error = await file.save();
      if (error) console.log(error);
      return file;
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

      const newfile = new files({
        filename,
      });
      const error = await newfile.save();
      if (error) console.log(error);

      return true;
    },
  },
};

export default resolvers;

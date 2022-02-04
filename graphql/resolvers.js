import { getMovies, idDuplicationCheck } from "./db";
import { movies } from "../schema/movie";
import { files } from "../schema/file";
import { users } from "../schema/user";

import { AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";
import sha256 from "crypto-js/sha256";
import rand from "csprng";

const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

const resolvers = {
  Query: {
    users: (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Not Authenticated");
      if (user.roles !== "admin") throw new ForbiddenError("Not Authorized");

      return users;
    },

    user: (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Not Authenticated");

      return user;
    },
    files: () => files.find({}),
    movies: () => getMovies(),
    createtests: () => tests.createCollection().then(() => console.log("tt")),
  },
  Mutation: {
    signUp: async (_, { userId, nickname, password }) => {
      const user = await users.find({ userId });
      if (user.length === 0) return false;

      const salt = await bcrypt.genSalt();
      bcrypt.hash(password, salt, async function (err, passwordHash) {
        const newUser = new users({
          id: users.length + 1,
          nickname,
          userId,
          passwordHash,
          role: "user",
          token: "",
        });

        if (err) console.log(err);
        const error = await newUser.save();
      });

      return true;
    },

    login: async (_, { userId, password }) => {
      let user = await users.find({ userId });
      if (!user) return null;
      if (user.token) return null;
      if (user.length === 0) return null;
      if (user) user = user[0];

      if (!bcrypt.compareSync(password, user.passwordHash)) return null;
      user.token = sha256(rand(160, 36) + userId + password).toString();
      await user.save();
      return user;
    },

    logout: (_, __, { user }) => {
      if (user && user.token) {
        user.token = "";
        return true;
      }

      throw new AuthenticationError("No Authenticated");
    },

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
      for (let i = 0; i < file.length; i++) {
        const { createReadStream, filename, mimtype } = await file[i];
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
        if (error) console.log(error);
        const error = await newfile.save();
      }

      return true;
    },
  },
};

export default resolvers;

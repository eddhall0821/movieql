import { getMovies, idDuplicationCheck } from "./db";
import { movies } from "../schema/movie";
import { files } from "../schema/file";
import { users } from "../schema/user";

import { AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";
import sha256 from "crypto-js/sha256";
import rand from "csprng";
import { and, not, or, shield } from "graphql-shield";
import { isAdmin, isAuthenticated, isChecker, isWorker } from "./permissions";
import seedrandom from "seedrandom";
import { mkdir } from "fs";
import { projects } from "../schema/project";

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

    projects: () => projects.find({}),
    files: async () => files.find({}),
    movies: () => getMovies(),
    createtests: () => tests.createCollection().then(() => console.log("tt")),
    worker_files: () => files.find({ ai_worked: true }),
  },
  Mutation: {
    signUp: async (_, { userId, nickname, password }) => {
      const user = await users.find({ userId });
      const userCount = await users.countDocuments({});

      if (user.length !== 0) return false;
      const salt = await bcrypt.genSalt();
      bcrypt.hash(password, salt, async function (err, passwordHash) {
        const newUser = new users({
          id: users.length + 1,
          nickname,
          userId,
          passwordHash,
          role: "worker",
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

    logout: async (_, __, { user }) => {
      const me = await user;

      if (me && me.token) {
        me.token = "";
        await me.save();
        return true;
      }

      throw new AuthenticationError("No Authenticated");
    },

    addProject: async (_, { data }) => {
      const id = seedrandom(data.project_name).int32();
      const project = new projects({
        id,
        ...data,
      });
      const error = await project.save();
      if (error) console.log(error);

      // return project;
      return true;
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
      const project_name = "project name";
      const id = seedrandom(project_name).int32();
      console.log(id);
      mkdir(`images/${id}`, { recursive: true }, (err) => {
        if (err) throw err;
      });

      for (let i = 0; i < file.length; i++) {
        const { createReadStream, filename, mimtype } = await file[i];
        const stream = createReadStream();

        const out = createWriteStream(
          path.join(__dirname, "../images", id.toString(), filename)
        );
        stream.pipe(out);
        await finished(out);
        const newfile = new files({
          id,
          filename,
        });
        if (error) console.log(error);
        const error = await newfile.save();
      }

      return true;
    },
  },
};

export const permissions = shield({
  Query: {
    files: and(isAuthenticated, or(isWorker, isChecker, isAdmin)),
  },
  Mutation: {
    logout: isAuthenticated,
    uploadFile: and(isAuthenticated, isAdmin),
  },
});

export default resolvers;

import { getMovies, idDuplicationCheck } from "./db";
import { movies } from "../schema/movie";
import { files } from "../schema/file";
import { users } from "../schema/user";
const tesseract = require("node-tesseract-ocr");
import { AuthenticationError } from "apollo-server";
import bcrypt from "bcrypt";
import sha256 from "crypto-js/sha256";
import rand from "csprng";
import { and, not, or, shield } from "graphql-shield";
import { isAdmin, isAuthenticated, isChecker, isWorker } from "./permissions";
import seedrandom from "seedrandom";
import { existsSync, mkdir, unlinkSync } from "fs";
import { projects } from "../schema/project";
var createImageSizeStream = require("image-size-stream");

const { finished } = require("stream/promises");
const { createWriteStream } = require("fs");
const path = require("path");

export const SERVER = "http://localhost:4000";

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
    projectValidation: async (_, { id, project_type }) => {
      const document_count = await projects.countDocuments({
        id,
        project_type,
      });
      if (document_count === 0) {
        return false;
      }
      return true;
    },

    project: async (_, { id }) => {
      return await files.find({ id });
    },

    projects: () => projects.find({}),
    files: async () => files.find({}),
    movies: () => getMovies(),
    createtests: () => tests.createCollection().then(() => console.log("tt")),
    workerFile: async (_, { userId }) => {
      const work_in_progress = await files.countDocuments({
        ai_worked: true,
        worked: false,
        work_assigned: true,
        worker: userId,
      });

      if (work_in_progress > 0) {
        return files.findOne({
          ai_worked: true,
          worked: false,
          work_assigned: true,
          worker: userId,
        });
      } else {
        return files.findOneAndUpdate(
          { ai_worked: true, work_assigned: false },
          { work_assigned: true, worker: userId }
        );
      }
    },

    getDocumentById: (_, { _id }) => {
      return files.findOne({
        _id,
      });
    },

    // worker_files: () =>
    //   files.findOneAndUpdate(
    //     { ai_worked: true, work_assigned: false },
    //     { work_assigned: true }
    //   ),
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
          role: "admin",
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
      const file = new files({
        ...args.data,
      });
      const error = await file.save();
      if (error) console.log(error);
      return file;
    },
    deleteFile: async (_, { _id, id, filename }) => {
      console.log(_id, id, filename);
      const filePath = `images/${id}/${filename}`;

      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      const file = await files.findOneAndDelete({
        _id,
      });
      return true;
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
    tesseract: async (_, args) => {
      const config = {
        lang: "kor+eng",
        oem: 1,
        psm: 3,
      }      
      tesseract
        .recognize(
          "http://www.musicscore.co.kr/sample/samp7ys7f3ij9wkjid8eujfhsiud843dsijfowejfisojf3490fi0if0sjk09jkr039uf90u/8u4ojsjdjf430foeid409ijef923jerojfgojdofj894jjdsf934f90f40ufj390rfjds/sample_63000/sample_3zICj22vAF2018111620349.jpg",
          config
        )
        .then((text) => {
          console.log("Result:", text);
        })
        .catch((error) => {
          console.log(error.message);
        });
      return true;
    },

    uploadFile: async (_, { file, id }) => {
      mkdir(`images/${id}`, { recursive: true }, (err) => {
        if (err) throw err;
      });

      for (let i = 0; i < file.length; i++) {
        const { createReadStream, filename, mimtype } = await file[i];
        const stream = createReadStream();
        const size = createImageSizeStream();
        let dimensions;
        size.on("size", function (d) {
          dimensions = d;
        });
        stream.pipe(size);
        const out = createWriteStream(
          path.join(__dirname, "../images", id.toString(), filename)
        );

        stream.pipe(out);
        await finished(out);
        const newfile = new files({
          id,
          filename,
          original_width: dimensions.width,
          original_height: dimensions.height,
        });
        if (error) console.log(error);
        const error = await newfile.save();
      }

      return true;
    },

    labelSubmit: async (_, { _id, id, data }) => {
      const file = await files.findOneAndUpdate(
        { _id, id },
        { worked: true, worker_data: data }
      );
      if (file) {
        return true;
      } else {
        return false;
      }
    },
  },
};

export const permissions = shield({
  Query: {
    files: and(isAuthenticated, or(isWorker, isChecker, isAdmin)),
    workerFile: and(isAuthenticated, or(isWorker, isChecker, isAdmin)),
  },
  Mutation: {
    // logout: and(isAuthenticated, or(isWorker, isChecker, isAdmin)),
    labelSubmit: and(isAuthenticated, or(isWorker, isChecker, isAdmin)),
    uploadFile: and(isAuthenticated),
  },
});

export default resolvers;

import { movies } from "../schema/movie";
import { files } from "../schema/file";
import { users } from "../schema/user";
import seedrandom from "seedrandom";

export const getMovies = () => {
  return movies.find({});
};

export const getFiles = () => {
  return files.find({});
};

export const idDuplicationCheck = async (userId) => {
  const aggregate = await users.aggregate([{ $match: { userId } }]);
  if (aggregate.length === 0) return false;
  return true;
};

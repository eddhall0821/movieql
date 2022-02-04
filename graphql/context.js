import { users } from "../schema/user";

const context = ({ req }) => {
  console.log(req);
  // const token = req.headers.authorization || "";
  // no login token
  // if (token.length != 64) return { user: null };
  // const user = users.find((user) => user.token === token);
  // console.log(token);
  return true;
  // return { user };
};

export default context;

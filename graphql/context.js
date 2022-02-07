import { users } from "../schema/user";

export const getUser = async (ctx) => {
  const token = ctx.request.get("Authorization") || "";
  if (token.length != 64) return { user: null };
  const user = await users.find({ token });
  return user[0];
};

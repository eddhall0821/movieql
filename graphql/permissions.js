import { GraphQLServer } from "graphql-yoga";
import { ContextParameters } from "graphql-yoga/dist/types";
import { rule, shield, and, or, not } from "graphql-shield";

export const isAuthenticated = rule({ cache: "contextual" })(
  async (_, __, { user }) => {
    const me = await user;
    return me.user !== null;
  }
);

export const isAdmin = rule({ cache: "contextual" })(
  async (_, __, { user }) => {
    const me = await user;
    return me.role === "admin";
  }
);

export const isChecker = rule({ cache: "contextual" })(
  async (_, __, { user }) => {
    const me = await user;
    return me.role === "checker";
  }
);

export const isWorker = rule({ cache: "contextual" })(
  async (_, __, { user }) => {
    const me = await user;
    return me.role === "worker";
  }
);

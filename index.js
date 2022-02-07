import { GraphQLServer } from "graphql-yoga";
import { getUser, isAdmin, isAuthenticated } from "./graphql/context";
import context from "./graphql/context";
import resolvers, { permissions } from "./graphql/resolvers";
import { users } from "./schema/user";
import { and, not, shield } from "graphql-shield";

const dbConnect = require("./models");
const express = require("express");
const path = require("path");
dbConnect();

const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
  middlewares: [permissions],
  context: (req) => ({
    ...req,
    user: getUser(req),
  }),
});

server.express.use("/images", express.static("images"));
server.start(() => console.log("Graphql Server Runing"));

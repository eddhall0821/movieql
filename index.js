import { GraphQLServer } from "graphql-yoga";
import context from "./graphql/context";
import resolvers from "./graphql/resolvers";
const dbConnect = require("./models");
const express = require("express");
const path = require("path");

dbConnect();
const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
  context: (ctx) => {
    // const { req } = ctx.request;
    const token = ctx.request.headers.authorization | "";
    console.log(token);
    // console.log(ctx.request);
  },
});

server.express.use("/images", express.static("images"));
server.start(() => console.log("Graphql Server Runing"));

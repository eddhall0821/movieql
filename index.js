import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolvers";
const dbConnect = require("./models");
const express = require("express");
const path = require("path");

dbConnect();
const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
});

server.express.use("/images", express.static("images"));
server.start(() => console.log("Graphql Server Runing"));

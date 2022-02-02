import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolvers";
const dbConnect = require('./models');

dbConnect();
const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
});

server.start(() => console.log("Graphql Server Runing"));

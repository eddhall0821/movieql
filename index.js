import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/resolvers";
import { mongoose } from "mongoose";

const MONGO_URL = `mongodb://admin:admin@localhost:27017`;
const server = new GraphQLServer({
  typeDefs: "graphql/schema.graphql",
  resolvers,
});

module.exports = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

server.start(() => console.log("Graphql Server Runing"));

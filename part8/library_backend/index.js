const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  } 

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
    
  type Book { 
      title: String!
      published: Int!
      author: Author!
      id: ID!
      genres: [String!]!
  }

  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }
  type Mutation {
      addBook(
          title: String!
          author: String!
          published: Int!
          genres: [String!]!
      ): Book

      editAuthor(
          name: String!
          setBornTo: Int!
      ): Author

       createUser(
        username: String!
        favoriteGenre: String!
      ): User

      login(
        username: String!
        password: String!
      ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),

    authorCount: async () => await Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      if (Object.keys(args).length === 0) {
        const coso = await Book.find({}).populate("author");
        console.log("books: ", coso);
        return coso;
      }

      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return []; // No books if author not found
        }
        return await Book.find({
          genres: args.genre,
          author: author._id,
        }).populate("author");
      }
      if (args.genre) {
        return await Book.find({
          genres: args.genre,
        }).populate("author");
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) {
          return []; // No books if author not found
        }
        return await Book.find({
          author: author._id,
        }).populate("author");
      }
    },

    allAuthors: async () => {
      return await Author.find({});
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const foundBook = await Book.find({
        "author.name": { $eq: args.author },
      });
      if (foundBook.length > 0) {
        throw new GraphQLError(
          "Title must be unique, another book with the same title already exists",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
            },
          }
        );
      }
      if (args.genres.length === 0) {
        throw new GraphQLError("The book must contain at least one genre", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      try {
        let author = await Author.findOne({
          name: { $eq: args.author },
        });

        if (!author) {
          author = new Author({
            name: args.author,
            id: uuid(),
            born: null,
            bookCount: 0,
          });
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author,
        });
        await book.save();

        author.bookCount = author.bookCount + 1;

        await author.save();
        return book;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError(error, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        console.log("error: ", error);
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      // Hardcoded for testing purposes
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

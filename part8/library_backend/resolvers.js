const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),

    authorCount: async () => await Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      if (Object.keys(args).length === 0) {
        const books = await Book.find({}).populate("author");
        console.log("books: ", books);
        return books;
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

    allGenres: async () => {
      const genres = await Book.aggregate([
        {
          $unwind: "$genres",
        },
        { $group: { _id: null, distinctGenres: { $addToSet: "$genres" } } },

        { $project: { _id: 0, distinctGenres: 1 } },
      ]);
      // This returns an array with a dictionary which its only key is "distinctGenres"
      return genres[0].distinctGenres;
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
      if (args.author.length < 4) {
        throw new GraphQLError(
          "Author name must be at least 4 characters long",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
            },
          }
        );
      }
      try {
        let author = await Author.findOne({
          name: { $eq: args.author },
        });

        if (!author) {
          author = new Author({
            name: args.author,
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

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;

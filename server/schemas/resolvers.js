const { User } = require("../models");
const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require("../utils/auth");
const { sign } = require("jsonwebtoken");
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Need to be logged in')
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Unable to login");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Unable to login");
      }

      const token = sign(user);
      return { token, user };
    },
  },
  saveBook: async (parent, args) => {
    const updatedUser = await User.findOneAndUpdate(
      { _id: args.username },
      { $addToSet: { savedBooks: args.bookId } })

    return updatedUser;
  },
  removeBook: async (parent, args) => {
    const updatedUser = await User.findOneAndUpdate(
      { username: args.username},
      { $pull: { savedBooks: { bookId: args.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find user with this id!" });
    }
    return updatedUser;
  },
};

module.exports = resolvers;

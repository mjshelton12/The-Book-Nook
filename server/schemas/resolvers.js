const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");

const { signToken } = require("../utils/auth");
const { sign } = require("jsonwebtoken");
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('need to be logged In')
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);

      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new AuthenticationError("Incorrect email");
      }

      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Incorrect Password");
      }

      const token = sign(user);

      return { token, user };
    },
  },
};

module.exports = resolvers;

const { User } = require('../models');

const resolvers = {
    Query: {
        user: async () => {
            return User.findOne({_id: userId})
        }
    },

   Mutation: {
        addUser: async (parent, { body }) => {
            return User.create({ body });
        },
        signToken: async (parent, { userId, token }) => {
            return User.findOneAndUpdate(
                {_id: userId },
                { new: true, runValidators: true}
            )
        }
    }
}

 
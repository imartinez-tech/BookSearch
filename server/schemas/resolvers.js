const { AuthenticatorError } = require('apollo-server-express'); 
const { User } = require('../models');

const resolvers = { 
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.find({ _id: context.user._id });
            }
            throw new AuthenticationError('Log in!');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await user.findOne({ email });
            if (!user) {
                throw new AuthenticationrError('No match with this email!');
                
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');               
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user); 
            
            return{ token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData} },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticatorError('Request error!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) { 
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id }, 
                    { $pull: { savedBooks: {bookId: bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticatorError('Log in!')
        }



    }
};

module.exports = resolvers;
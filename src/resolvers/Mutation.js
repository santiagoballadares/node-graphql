const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

const signup = async (root, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.createUser({ ...args, password });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (root, args, context, info) => {
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const post = (root, args, context, info) => {
  const userId = getUserId(context);

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } },
  });
};

const updateLink = async (root, args, context, info) => {
  const userId = getUserId(context);
  const linkExists = await context.prisma.$exists.link({ id: args.id });

  if (!linkExists) {
    throw new Error(`Cannot find link: ${args.id}`);
  }

  const data = {};
  if (args.url) {
    data.url = args.url;
  }
  if (args.description) {
    data.description = args.description;
  }
  
  const where = { id: args.id };

  return context.prisma.updateLink({ data, where });
};

const deleteLink = async (root, args, context, info) => {
  const userId = getUserId(context);
  const linkExists = await context.prisma.$exists.link({ id: args.id });

  if (!linkExists) {
    throw new Error(`Cannot find link: ${args.id}`);
  }

  return context.prisma.deleteLink({ id: args.id });
};

const vote = async (root, args, context, info) => {
  const userId = getUserId(context);
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  });
};

module.exports = {
  signup,
  login,
  post,
  updateLink,
  deleteLink,
  vote,
};

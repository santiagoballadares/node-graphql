const { getUserId } = require('../utils');

const info = () => `This is the API of a GraphQL Node project.`;

const feed = (root, args, context, info) => {
  const userId = getUserId(context);
  return context.prisma.links();
};

module.exports = {
  info,
  feed,
};

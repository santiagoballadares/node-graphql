const newLinkSubscribe = (root, args, context, info) => {
  return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node();
};

const newLinkResolve = payload => {
  return payload;
};

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: newLinkResolve,
};

const newVoteSubscribe = (root, args, context, info) => {
  return context.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).node();
};

const newVoteResolve = (payload) => {
  return payload;
};

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: newVoteResolve,
};

module.exports = {
  newLink,
  newVote,
};

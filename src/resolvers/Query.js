const info = () => `This is the API of a GraphQL Node project.`;

const feed = async (root, args, context, info) => {
  const where = args.filter ? {
    OR: [
      { description_contains: args.filter },
      { url_contains: args.filter },
    ],
  } : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.linksConnection({
    where,
    skip: args.skip,
    first: args.first,
  })
  .aggregate()
  .count();

  return {
    links,
    count,
  };
};

const link = async (root, args, context, info) => {
  return await context.prisma.link({ id: args.id });
};

module.exports = {
  info,
  feed,
  link,
};

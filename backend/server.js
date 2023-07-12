const fastify = require('fastify')({ logger: true });

const { parse_mps } = require('./parser.js');

fastify.get('/', async (request, reply) => {
  const mps = request.query.mps.split(',');
  let res = await parse_mps(mps);
  return res;
});

const start = async () => {
  try {
    await fastify.listen({ port: 2343 });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
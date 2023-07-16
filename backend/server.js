const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

const { parse_mps } = require('./parser.js');

fastify.get('/', async (request, reply) => {
  const mps = request.query.mps.split(',');
  let res = await parse_mps(mps);
  return res;
});

const start = async () => {
  try {
    await fastify.register(cors);
    await fastify.listen(2343, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
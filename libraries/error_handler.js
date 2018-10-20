const ExtendableError = require('es6-error');
const logger = require('../libraries/log4');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ExtendableError) {
      ctx.status = err.status;
      ctx.body = err.body;
      logger.error(err.body);
    } else {
      ctx.status = 500;
      ctx.body = {
        errors: [{
          message: err.message,
          stack: err.stack, // remove in production
        }],
      };
    }
    logger.error(err.message);
    logger.error(err.stack);
    ctx.app.emit('error', err, ctx);
  }
};

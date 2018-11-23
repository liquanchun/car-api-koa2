const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../env').jwt;
const { Unauthorized } = require('../libraries/error');

module.exports = async (ctx, next) => {
  // 如果是用户登录，则不验证权限
  if (ctx.url.includs('login')) {
    await next();
  }
  const { header: { token } } = ctx;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.secret);
      const user = await User.findOne({
        userid: decoded.userid,
      });

      if (user && user.userid) {
        ctx.currentUser = user;
        await next();
      } else {
        throw new Unauthorized('无效的用户。');
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new Unauthorized('Token Expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new Unauthorized('Invalid Token');
      } else {
        throw err;
      }
    }
  } else {
    throw new Unauthorized('Missing Auth Token');
  }
};

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./libraries/error_handler');
const auth = require('./middlewares/auth');
const cors = require('koa-cors');
const config = require('./env');
const logger = require('./libraries/log4');

const app = new Koa();
const WebSocket = require('koa-websocket');

const wsapp = WebSocket(new Koa());
const ctxs = [];
wsapp.listen(3001);

/* websocket实现简单的接发消息 */
wsapp.ws.use((ctx, next) => {
  /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
  ctxs.push(ctx);
  ctx.websocket.on('message', (message) => {
    logger.info(`web socket message: ${message}`);
    for (let i = 0; i < ctxs.length; i++) {
      if (ctx == ctxs[i]) continue;
      ctxs[i].websocket.send(message);
    }
  });
  ctx.websocket.on('close', (message) => {
    /* 连接关闭时, 清理 上下文数组, 防止报错 */
    const index = ctxs.indexOf(ctx);
    ctxs.splice(index, 1);
  });
});

// enable cors
app.use(cors());

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.request.ip} ${ctx.url} - ${ms}ms`);
  if (ctx.request.body) {
    logger.info(`request body:${JSON.stringify(ctx.request.body)}`);
  }
});
// static files
app.use(require('koa-static')('./public'));

// request parameters parser
app.use(require('koa-body')({
  formidable: {
    uploadDir: `${__dirname}/public/uploads`, // This is where the files will be uploaded
    keepExtensions: true,
  },
  multipart: true,
  urlencoded: true,
}));

// error handler
app.use(errorHandler);

// validator
require('koa-validate')(app);

// 用户认证
// app.use(auth);

// set routes
fs.readdirSync('./app').filter(file => fs.statSync(path.join('./app', file)).isDirectory()).map((moduleName) => {
  fs.readdirSync(`./app/${moduleName}`).filter(file => fs.statSync(path.join(`./app/${moduleName}`, file)).isFile()).map((route) => {
    app.use(require(`./app/${moduleName}/${route}`).routes());
  });
});

app.listen(config.server.port, () => {
  logger.info(`API listening on port ${config.server.port}`);
});

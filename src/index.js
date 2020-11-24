const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { v4: uuidv4 } = require("uuid");
const { getData } = require("./utils/data");
const { downloadFile } = require("./utils/file");

const app = new Koa();
const router = new Router();

router.post("/playlist", (ctx) => {
  const fileId = uuidv4();
  downloadFile(ctx.request.body.url, fileId);

  ctx.body = {
    fileId,
  };
});

router.get("/playlist", (ctx) => {
  const { fileId, country } = ctx.request.query;
  ctx.body = getData(fileId, String(country).toUpperCase());
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

const path = require("path");
const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const { v4: uuidv4 } = require("uuid");
const { getData } = require("./utils/data");
const download = require("download");

const app = new Koa();
const router = new Router();

router.post("/playlist", async (ctx) => {
  const fileId = uuidv4();
  fs.writeFileSync(
    path.resolve(`playlists/${fileId}.m3u`),
    await download(ctx.request.body.url)
  );

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

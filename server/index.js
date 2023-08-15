import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import { generatorComponent } from "./generate.js";
import { writeCode } from "./writeCode.js";
import { downloadProject } from "./download.js";
import fs from "fs";

const router = new Router();

// 初始化 Koa 应用实例
const app = new Koa();

// 注册中间件
app.use(cors());

app.use(bodyParser());
app.use(router.routes());

router.post("/preview", generatorComponent, writeCode, async (ctx) => {
  ctx.body = {
    code: ctx.request.code,
  };
});

router.post("/download", downloadProject, async (ctx) => {
  // 检查文件是否存在
  const zipFilePath = ctx.downloadPath;
  if (!fs.existsSync(zipFilePath)) {
    ctx.status = 404;
    return;
  }
  // 设置响应头信息
  const stats = fs.statSync(zipFilePath);
  ctx.set({
    "Content-Type": "application/zip",
    "Content-Length": stats.size,
    "Content-Disposition": "attachment; filename=project.zip",
  });

  // 通过流将文件发送给客户端
  const stream = fs.createReadStream(zipFilePath);
  ctx.body = stream;
});

// 响应用户请求
app.use((ctx) => {
  ctx.body = "Hello React-drag";
});

// 运行服务器
app.listen(3003, () => {
  console.log("服务器运行成功～， 3003");
});

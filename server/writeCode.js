import path from "path";
import { fileURLToPath } from "url";
import ReactGenerator from "@teleporthq/teleport-component-generator-react";
import { ReactStyleVariation } from "@teleporthq/teleport-types";

import { writeFile, mkdir } from "node:fs/promises";

async function mkdirs(path) {
  try {
    await mkdir(path, { recursive: true });
    console.log(`文件夹 ${path} 创建成功`);
  } catch (error) {
    console.error(`创建文件夹 ${path} 失败: ${error}`);
  }
}

async function write(filePath, data, opt) {
  // 获取文件目录
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dirname = path.join(__dirname, path.dirname(filePath));
  const filename = path.basename(filePath);
  // 递归创建文件夹
  const finFilePath = path.join(dirname, filename);
  try {
    await mkdirs(dirname);
    await writeFile(finFilePath, data, opt);
    console.log(`写入文件 ${finFilePath} 成功`);
  } catch (error) {
    console.error(`写入文件 ${finFilePath} 失败: ${error}`);
  }
}

const writeCode = async (ctx, next) => {
  const { UIDL } = ctx.request.body;
  console.log(UIDL);
  const generator = ReactGenerator.createReactComponentGenerator({
    variation: ReactStyleVariation.CSS,
  });
  const res = await generator.generateComponent(UIDL);
  console.log(res);
  const componentCtx = res.files[0];
  const styleCtx = res.files[1] || { name: ctx.name };
  await write(
    "./code/template/src/" + componentCtx.name + ".tsx",
    componentCtx.content,
    {
      flag: "w",
      encoding: "utf8",
    }
  );
  await write(
    "./code/template/src/" + styleCtx.name + "." + styleCtx.fileType,
    styleCtx.content,
    {
      flag: "w",
      encoding: "utf8",
    }
  );
  ctx.request.code = componentCtx;

  await next();
};

export { writeCode };

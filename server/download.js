import fs from "fs";
import archiver from "archiver";
import path from "path";
import { fileURLToPath } from "url";

export const downloadProject = async (ctx, next) => {
  function zipFolder(
    folderPath,
    zipPath,
    opt = {
      exclude: [],
    }
  ) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      output.on("close", () => {
        console.log("文件打包成功！");
        resolve();
      });
      archive.on("error", (err) => {
        console.error("文件打包失败：", err);
        reject(err);
      });
      archive.pipe(output);

      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (opt.exclude.includes(file)) continue;
        const filePath = `${folderPath}/${file}`;
        const stat = fs.lstatSync(filePath);
        if (stat.isFile()) {
          archive.file(filePath, { name: file });
        } else if (stat.isDirectory()) {
          archive.directory(filePath, file);
        }
      }

      archive.finalize();
    });
  }

  // 使用方式示例
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const folderPath = path.resolve(__dirname, "./code/template"); // 要打包的文件夹路径
  const zipPath = path.resolve(__dirname, "./dist.zip"); // 压缩文件的输出路径

  try {
    await zipFolder(folderPath, zipPath, {
      exclude: ["node_modules", ".DS_Store"],
    });
    ctx.downloadPath = zipPath;
    await next();
    console.log("文件夹打包完成！");
  } catch (error) {
    console.error("文件夹打包失败：", error);
  }
};

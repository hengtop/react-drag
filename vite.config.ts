import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import postcsspxtoviewport8plugin from "postcss-px-to-viewport-8-plugin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      { find: "@@", replacement: path.resolve(__dirname, "server") },
    ],
  },
  build: {
    rollupOptions: {
      input: {
        editor: path.resolve(__dirname, "index.html"),
        preview: path.resolve(__dirname, "src/pages/previewApp/index.html"),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport8plugin({
          unitToConvert: "px",
          viewportWidth: 1920,
          unitPrecision: 5, // 单位转换后保留的精度
          propList: ["*"], // 能转化为vw的属性列表
          viewportUnit: "vw", // 希望使用的视口单位
          fontViewportUnit: "vw", // 字体使用的视口单位
          selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
          minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
          mediaQuery: true, // 媒体查询里的单位是否需要转换单位
          replace: true, //  是否直接更换属性值，而不添加备用属性
          exclude: [/node_modules\/antd/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
          landscapeUnit: "vw", // 横屏时使用的单位
          landscapeWidth: 1024, // 横屏时使用的视口宽度
        }),
      ],
    },
  },
});

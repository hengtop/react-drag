import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ToolBarWrapper } from "./style";
import { getStyle, _ } from "@/utils";
import {
  saveComponentData,
  setCodeEditorShow,
  undo,
  redo,
  copy,
  paste,
  deleteCom,
} from "@/pages/home/store";
import { httpRequest } from "@/server";

let flag = false;
export default function ToolBar() {
  const dispatch = useAppDispatch();
  const { componentData } = useAppSelector((state) => state.home);

  const handleSaveEvent = () => {
    dispatch(saveComponentData());
  };
  const handlePreviewCode = () => {
    flag = !flag;
    dispatch(setCodeEditorShow(flag));
  };

  const handleGenerateCode = async () => {
    // 获取保存的代码数组，生成项目
    const clonecComponentData = _.cloneDeep(componentData);
    clonecComponentData.forEach((component) => {
      console.log("7", getStyle(component.style));
      component.style = getStyle(component.style);
    });
    const res = await httpRequest.post({
      url: "/preview",
      data: {
        componentData: clonecComponentData,
      },
    });
    console.log(res);
  };

  const handleDownload = async () => {
    const response = await httpRequest.post({
      url: "/download",
      responseType: "blob",
    });
    const blob = new Blob([response]);
    // 创建一个隐藏的链接元素
    // 将文件流转为url进行下载
    const url = URL.createObjectURL(blob);
    // 创建一个临时a标签进行下载操作
    const a = document.createElement("a");
    a.href = url;
    // 这里就标志着下载的名称
    a.download = "project.zip";
    // 添加进文档并手动出发点击
    document.body.appendChild(a);
    a.click();
    // 移除标签
    a.parentNode.removeChild(a);
  };
  return (
    <ToolBarWrapper>
      <Link to={`/preview`} target="_blank" rel="opener">
        预览
      </Link>
      <button onClick={handleSaveEvent}>保存</button>
      <button onClick={handlePreviewCode}>预览代码{`</>`}</button>
      <button onClick={handleGenerateCode}>代码生成{`GC`}</button>
      <Link to={`/purePreview`} target="_blank" rel="opener">
        GC预览
      </Link>
      <button onClick={handleDownload}>下载</button>
      <button onClick={() => dispatch(undo())}>回到上一步</button>
      <button onClick={() => dispatch(redo())}>回到下一步</button>
      <button onClick={() => dispatch(copy())}>复制</button>
      <button onClick={() => dispatch(paste())}>粘贴</button>
      <button onClick={() => dispatch(deleteCom())}>删除</button>
    </ToolBarWrapper>
  );
}

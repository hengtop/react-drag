import { lazy, useEffect, useCallback, useState, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  isPreventDrop,
  $,
  getComponentRotatedStyle,
  getStyle,
  getShapeStyle,
} from "@/utils";
import { setAreaData } from "@/pages/home/store";

import Grid from "./Grid";
import { EditorWrapper } from "./style";
import Shape from "./Shape";
import MarkLine from "./MarkLine";
import DynComponent from "@/components/DynComponent";
import path from "path";
const componentMap = new Map();

const Editor = memo(function Editor() {
  console.log(666777);
  const [editorData, setEditorData] = useState({
    editorX: 0,
    editorY: 0,
    start: {
      // 选中区域的起点
      x: 0,
      y: 0,
    },
    width: 0,
    height: 0,
    isShowArea: false,
    svgFilterAttrs: ["width", "height", "top", "left", "rotate"],
  });

  const [editor, setEditor] = useState<Element | null>(null);
  useEffect(() => {
    if (editor === null) {
      setEditor($("#editor"));
    }
  }, [editor]);

  const dispatch = useAppDispatch();
  const { componentData, curComponent } = useAppSelector((state) => state.home);

  // 画布鼠标按下事件
  const handleMouseDown = (e) => {
    if (
      !curComponent ||
      (curComponent && isPreventDrop(curComponent.component))
    ) {
      e.preventDefault();
    }

    hideArea();

    // 获取编辑器的位置信息
    console.log(editor);
    const rectInfo = editor?.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    console.log(rectInfo);
    rectInfo &&
      setEditorData({
        ...editorData,
        editorX: rectInfo?.x,
        editorY: rectInfo?.y,
        start: {
          x: startX - rectInfo?.x,
          y: startY - rectInfo?.y,
        },
        isShowArea: true,
      });

    const move = (moveEvent) => {
      setEditorData({
        ...editorData,
        width: Math.abs(moveEvent.clientX - startX),
        height: Math.abs(moveEvent.clientY - startY),
      });
      const start = editorData.start;
      if (moveEvent.clientX < startX) {
        rectInfo &&
          setEditorData({
            ...editorData,
            start: {
              ...start,
              x: moveEvent.clientX - rectInfo?.x,
            },
          });
      }

      if (moveEvent.clientY < startY) {
        rectInfo &&
          setEditorData({
            ...editorData,
            start: {
              ...start,
              y: moveEvent.clientY - rectInfo?.y,
            },
          });
      }
    };

    const up = (e) => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      if (e.clientX == startX && e.clientY == startY) {
        hideArea();
        return;
      }
      createGroup();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const hideArea = useCallback(() => {
    setEditorData({
      ...editorData,
      isShowArea: false,
      width: 0,
      height: 0,
    });
    const data = {
      style: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      components: [],
    };

    dispatch(setAreaData({ data }));
  }, [dispatch, editorData]);

  const createGroup = useCallback(() => {
    // 获取选中区域的组件数据
    const areaData = getSelectArea();
    if (areaData.length <= 1) {
      hideArea();
      return;
    }

    // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
    // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
    let top = Infinity,
      left = Infinity;
    let right = -Infinity,
      bottom = -Infinity;
    areaData.forEach((component) => {
      let style = {};
      if (component.component == "Group") {
        component.propValue.forEach((item) => {
          const rectInfo = $(`#component${item.id}`).getBoundingClientRect();
          style.left = rectInfo.left - editorData.editorX;
          style.top = rectInfo.top - editorData.editorY;
          style.right = rectInfo.right - editorData.editorX;
          style.bottom = rectInfo.bottom - editorData.editorY;

          if (style.left < left) left = style.left;
          if (style.top < top) top = style.top;
          if (style.right > right) right = style.right;
          if (style.bottom > bottom) bottom = style.bottom;
        });
      } else {
        style = getComponentRotatedStyle(component.style);
      }

      if (style.left < left) left = style.left;
      if (style.top < top) top = style.top;
      if (style.right > right) right = style.right;
      if (style.bottom > bottom) bottom = style.bottom;
    });
    setEditorData({
      ...editorData,
      width: right - left,
      height: bottom - top,
      start: {
        x: left,
        y: top,
      },
    });
    const data = {
      style: {
        left,
        top,
        width: right - left,
        height: bottom - top,
      },
      components: areaData,
    };
    // 设置选中区域位移大小信息和区域内的组件数据
    dispatch(setAreaData({ data }));
  }, []);

  const getSelectArea = useCallback(() => {
    const result = [];
    // 区域起点坐标
    const { x, y } = editorData.start;
    // 计算所有的组件数据，判断是否在选中区域内
    componentData.forEach((component) => {
      if (component.isLock) return;

      const { left, top, width, height } = getComponentRotatedStyle(
        component.style
      );
      if (
        x <= left &&
        y <= top &&
        left + width <= x + editorData.width &&
        top + height <= y + editorData.height
      ) {
        result.push(component);
      }
    });

    // 返回在选中区域内的所有组件
    return result;
  }, []);

  const getComponentStyle = (style: any) => {
    return getStyle(style, ["top", "left", "rotate"]);
  };

  return (
    <EditorWrapper
      id="editor"
      width={1920}
      height={1080}
      onMouseDown={handleMouseDown}
    >
      <Grid />

      {componentData.map((item, index) => {
        // console.log("od", componentMap);
        // let AsyncComponent = null;
        // if (componentMap.has(item.id)) {
        //   AsyncComponent = componentMap.get(item.id);
        // } else {
        //   AsyncComponent = lazy(
        //     () => import(``)
        //   );
        //   componentMap.set(item.id, AsyncComponent);
        // }
        return (
          <Shape
            index={index}
            editor={editor}
            defaultStyle={item.style}
            key={item.id}
            componentSolt={
              <DynComponent
                isLibrary={item.isLibrary}
                localSrc={item.componentPath}
                style={getComponentStyle(item.style)}
                className="test"
              />
            }
            style={getShapeStyle(item.style)}
            id={"component" + item.id}
            element={item}
            active={item.id === curComponent?.id}
          />
        );
      })}

      <MarkLine />
    </EditorWrapper>
  );
});
export default Editor;

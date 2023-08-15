import type { RootState } from "@/store";
import { DragEvent, lazy, useCallback, useEffect } from "react";

import { useAppSelector, useAppDispatch } from "@/hooks";
import { useState } from "react";
import {
  addComponent,
  setInEditorStatus,
  setClickComponentStatus,
  setCurComponent,
  setShapeStyle,
  setShapeSingleStyle,
  recordSnapshot,
} from "./store";
import { $, _, generateID, changeComponentSizeWithScale } from "@/utils";

import { HomeWrapper, MainContainer } from "./style";
import ToolBar from "@/components/ToolBar";
import Editor from "@/components/Editor";
import Button from "@/custom-components/Button";
import RightToolBar from "@/components/RightToolBar";
import DynComponent from "@/components/DynComponent";
import Preview from "@/components/Preview";
import CodeEditor from "@/components/CodeEditor";

type CustomEventTargetType = { dataset: DOMStringMap } & EventTarget;

export default function Home() {
  const [componentList] = useState([
    {
      component: "Button",
      label: "按钮",
      propValue: "按钮",
      icon: "button",
      componentPath: "../../custom-components/Button",
      attrPath: "../../custom-components/Button/Attr",

      style: {
        width: 100,
        height: 34,
        borderWidth: 1,
        borderColor: "",
        borderRadius: "",
        fontSize: "",
        fontWeight: 400,
        lineHeight: "",
        letterSpacing: 0,
        textAlign: "",
        color: "",
        backgroundColor: "",
        rotate: 0,
        opacity: 1,
      },
    },
    {
      component: "Line",
      label: "折线图",
      propValue: "图表",
      icon: "line",
      componentPath: "../../custom-components/Line",
      attrPath: "../../custom-components/Line/Attr",
      style: {
        width: 300,
        height: 300,
        borderWidth: 1,
        borderColor: "",
        borderRadius: "",
        fontSize: "",
        fontWeight: 400,
        lineHeight: "",
        letterSpacing: 0,
        textAlign: "",
        color: "",
        backgroundColor: "",
        rotate: 0,
        opacity: 1,
      },
    },
    {
      component: "AntBtn",
      label: "组件btn",
      propValue: "按钮",
      icon: " btn",
      originalName: "Button",
      componentPath: "antd/es/button",
      isLibrary: true,
      attrPath: "../../custom-components/Line/Attr",
      style: {
        width: 100,
        height: 50,
        borderWidth: 1,
        borderColor: "",
        borderRadius: "",
        fontSize: "",
        fontWeight: 400,
        lineHeight: "",
        letterSpacing: 0,
        textAlign: "",
        color: "",
        backgroundColor: "",
        rotate: 0,
        opacity: 1,
      },
    },
  ]);
  const [editor, setEditor] = useState<Element | null>(null);
  const { isClickComponent, curComponent, codeEditor, componentData } =
    useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (editor === null) {
      setEditor($("#editor"));
    }
  }, [editor]);
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    const { index = "" } = (e.target as CustomEventTargetType).dataset;
    e.dataTransfer.setData("index", index);
    console.log(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const index = e.dataTransfer.getData("index");
    // 获取编辑器的尺寸属性
    const rectInfo = editor?.getBoundingClientRect();
    console.log(index, rectInfo);
    console.log(e);
    const component = _.cloneDeep(componentList[index]);
    component.style.top = e.clientY - rectInfo.y;
    component.style.left = e.clientX - rectInfo.x;
    component.id = generateID();
    changeComponentSizeWithScale(component);
    dispatch(addComponent({ component }));
    dispatch(recordSnapshot());
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    //console.log(e)
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    dispatch(setClickComponentStatus(false));
    dispatch(setInEditorStatus(true));
  };

  const deselectCurComponent = (e) => {
    if (!isClickComponent) {
      dispatch(setCurComponent({ component: null, index: null }));
    }
  };
  const handleEvent = useCallback((eventType: string, arg: any) => {
    console.log("动态组件中的事件", eventType, arg);
    if (arg.value == undefined) return;
    dispatch(setShapeSingleStyle(arg));
  }, []);
  return (
    <HomeWrapper>
      <ToolBar />
      <MainContainer>
        <section className="left">
          <div className="drag-wrapper" onDragStart={handleDragStart}>
            {componentList.map((item, index) => {
              return (
                <div
                  draggable
                  key={index}
                  data-index={index}
                  className="component-item"
                >
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section className="center">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleMouseDown}
            onMouseUp={deselectCurComponent}
          >
            <Editor />
          </div>
        </section>
        <section className="right">
          {curComponent && (
            <DynComponent
              localSrc={curComponent.attrPath}
              style={curComponent.style}
              handleEvent={handleEvent}
            />
          )}
        </section>
      </MainContainer>
      {codeEditor && <CodeEditor code={componentData} />}
    </HomeWrapper>
  );
}

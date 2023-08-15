import React, { useState, useRef, useEffect, memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { MarkLineWrapper } from "./style";
import { events, getComponentRotatedStyle } from "@/utils";
import { setShapeSingleStyle, setShapeStyle } from "@/pages/home/store";

const MarkLine = memo(function MarkLine() {
  console.log("799799");
  const linesRef = useRef({});

  const [markLineData, setMarkLineData] = useState({
    lines: ["xt", "xc", "xb", "yl", "yc", "yr"], // 分别对应三条横线和三条竖线
    diff: 3, // 相距 dff 像素将自动吸附
    lineStatus: {
      xt: false,
      xc: false,
      xb: false,
      yl: false,
      yc: false,
      yr: false,
    },
  });

  // const { curComponent, componentData } = useAppSelector((state) => state.home);
  //console.log('componentData',componentData)
  const dispatch = useAppDispatch();
  const moveBus = useCallback(
    (isDownward, isRightward, curComponent, componentData) => {
      showLine(isDownward, isRightward, curComponent, componentData);
    },
    []
  );
  const unMoveBus = useCallback(() => {
    hideLine();
  }, []);
  useEffect(() => {
    events.$on("move", moveBus);
    events.$on("unmove", unMoveBus);
    // return () => {
    //   events.$remove('move', moveBus)
    //   events.$remove('unmove', unMoveBus);
    // };
  }, [moveBus, unMoveBus]);

  const hideLine = () => {
    Object.keys(markLineData.lineStatus).forEach((line) => {
      setMarkLineData({
        ...markLineData,
        lineStatus: {
          ...markLineData.lineStatus,
          [line]: false,
        },
      });
    });
  };

  const showLine = (isDownward, isRightward, curComponent, componentData) => {
    const lines = linesRef.current;
    console.log("lines", lines);
    const components = componentData;
    const curComponentStyle = getComponentRotatedStyle(curComponent.style);
    const curComponentHalfwidth = curComponentStyle.width / 2;
    const curComponentHalfHeight = curComponentStyle.height / 2;
    console.log("curComponentStyle", curComponentStyle);

    hideLine();
    console.log("componentscomponents", components);
    components.forEach((component) => {
      if (component.id === curComponent.id) return;
      const componentStyle = getComponentRotatedStyle(component.style);
      const { top, left, bottom, right } = componentStyle;
      const componentHalfwidth = componentStyle.width / 2;
      const componentHalfHeight = componentStyle.height / 2;
      const conditions = {
        top: [
          {
            isNearly: isNearly(curComponentStyle.top, top),
            lineNode: lines.xt, // xt
            line: "xt",
            dragShift: top,
            lineShift: top,
          },
          {
            isNearly: isNearly(curComponentStyle.bottom, top),
            lineNode: lines.xt, // xt
            line: "xt",
            dragShift: top - curComponentStyle.height,
            lineShift: top,
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: isNearly(
              curComponentStyle.top + curComponentHalfHeight,
              top + componentHalfHeight
            ),
            lineNode: lines.xc, // xc
            line: "xc",
            dragShift: top + componentHalfHeight - curComponentHalfHeight,
            lineShift: top + componentHalfHeight,
          },
          {
            isNearly: isNearly(curComponentStyle.top, bottom),
            lineNode: lines.xb, // xb
            line: "xb",
            dragShift: bottom,
            lineShift: bottom,
          },
          {
            isNearly: isNearly(curComponentStyle.bottom, bottom),
            lineNode: lines.xb, // xb
            line: "xb",
            dragShift: bottom - curComponentStyle.height,
            lineShift: bottom,
          },
        ],
        left: [
          {
            isNearly: isNearly(curComponentStyle.left, left),
            lineNode: lines.yl, // yl
            line: "yl",
            dragShift: left,
            lineShift: left,
          },
          {
            isNearly: isNearly(curComponentStyle.right, left),
            lineNode: lines.yl, // yl
            line: "yl",
            dragShift: left - curComponentStyle.width,
            lineShift: left,
          },
          {
            // 组件与拖拽节点的中间是否对齐
            isNearly: isNearly(
              curComponentStyle.left + curComponentHalfwidth,
              left + componentHalfwidth
            ),
            lineNode: lines.yc, // yc
            line: "yc",
            dragShift: left + componentHalfwidth - curComponentHalfwidth,
            lineShift: left + componentHalfwidth,
          },
          {
            isNearly: isNearly(curComponentStyle.left, right),
            lineNode: lines.yr, // yr
            line: "yr",
            dragShift: right,
            lineShift: right,
          },
          {
            isNearly: isNearly(curComponentStyle.right, right),
            lineNode: lines.yr, // yr
            line: "yr",
            dragShift: right - curComponentStyle.width,
            lineShift: right,
          },
        ],
      };

      const needToShow = [];
      console.log("needToShow", needToShow);
      const { rotate } = curComponent.style;
      console.log("conditions", conditions);
      Object.keys(conditions).forEach((key) => {
        // 遍历符合的条件并处理
        conditions[key].forEach((condition) => {
          console.log("condition", condition);
          if (!condition.isNearly) return;
          dispatch(
            setShapeSingleStyle({
              key,
              value:
                rotate != 0
                  ? translatecurComponentShift(
                      key,
                      condition,
                      curComponentStyle,
                      curComponent
                    )
                  : condition.dragShift,
            })
          );
          // 修改当前组件位移
          // this.$store.commit("setShapeSingleStyle", {
          //   key,
          //   value:
          //     rotate != 0
          //       ? this.translatecurComponentShift(
          //           key,
          //           condition,
          //           curComponentStyle
          //         )
          //       : condition.dragShift,
          // });
          //dispatch(setShapeStyle())

          condition.lineNode.style[key] = `${condition.lineShift}px`;

          needToShow.push(condition.line);
        });
      });

      // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
      // 同一方向上的线只显示一条，例如多条横条只显示一条横线
      if (needToShow.length) {
        chooseTheTureLine(needToShow, isDownward, isRightward);
      }
    });
  };

  const translatecurComponentShift = (
    key,
    condition,
    curComponentStyle,
    curComponent
  ) => {
    const { width, height } = curComponent.style;
    if (key == "top") {
      return Math.round(
        condition.dragShift - (height - curComponentStyle.height) / 2
      );
    }

    return Math.round(
      condition.dragShift - (width - curComponentStyle.width) / 2
    );
  };

  const chooseTheTureLine = (needToShow, isDownward, isRightward) => {
    console.log("needToShow", needToShow);
    // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
    // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
    const newLineStatus = { ...markLineData.lineStatus };
    if (isRightward) {
      if (needToShow.includes("yr")) {
        newLineStatus.yr = true;
      } else if (needToShow.includes("yc")) {
        newLineStatus.yc = true;
      } else if (needToShow.includes("yl")) {
        newLineStatus.yl = true;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes("yl")) {
        newLineStatus.yl = true;
      } else if (needToShow.includes("yc")) {
        newLineStatus.yc = true;
      } else if (needToShow.includes("yr")) {
        newLineStatus.yr = true;
      }
    }

    if (isDownward) {
      if (needToShow.includes("xb")) {
        newLineStatus.xb = true;
      } else if (needToShow.includes("xc")) {
        newLineStatus.xc = true;
      } else if (needToShow.includes("xt")) {
        newLineStatus.xt = true;
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (needToShow.includes("xt")) {
        newLineStatus.xt = true;
      } else if (needToShow.includes("xc")) {
        newLineStatus.xc = true;
      } else if (needToShow.includes("xb")) {
        newLineStatus.xb = true;
      }
    }
    setMarkLineData({
      ...markLineData,
      lineStatus: {
        ...newLineStatus,
      },
    });
  };
  console.log("markLineData.lineStatus", markLineData.lineStatus);

  const isNearly = (dragValue, targetValue) => {
    console.log("diff", dragValue, targetValue);
    return Math.abs(dragValue - targetValue) <= markLineData.diff;
  };

  return (
    <MarkLineWrapper>
      {markLineData.lines.map((line) => {
        return (
          <div
            style={{
              display: markLineData.lineStatus[line] ? "block" : "none",
            }}
            key={line}
            ref={(ref) => {
              linesRef.current[line] = ref;
            }}
            className={`line ${line.includes("x") ? "xline" : "yline"}`}
          ></div>
        );
      })}
    </MarkLineWrapper>
  );
});

export default MarkLine;

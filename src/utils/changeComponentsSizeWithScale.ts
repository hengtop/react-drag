import { divide, multiply } from "mathjs";
import { store } from "@/store";

const needToChangeAttrs2 = ["width", "height", "fontSize"];
// todo 类型补充
export function changeComponentSizeWithScale(component: any) {
  const { canvasStyleData } = store.getState().home;
  Object.keys(component.style).forEach((key) => {
    if (needToChangeAttrs2.includes(key)) {
      if (key === "fontSize" && component.style[key] === "") return;

      component.style[key] = format(
        component.style[key],
        canvasStyleData.scale
      );
    }
  });
}

function format(value: number, scale: number) {
  return multiply(value, divide(parseFloat(String(scale)), 100));
}

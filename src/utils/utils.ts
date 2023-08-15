export function $(selector: string) {
  return document.querySelector(selector);
}

function angleToRadian(angle) {
  return (angle * Math.PI) / 180;
}

export function sin(rotate) {
  return Math.abs(Math.sin(angleToRadian(rotate)));
}

export function cos(rotate) {
  return Math.abs(Math.cos(angleToRadian(rotate)));
}

const components = ["Text", "RectShape", "CircleShape"];
/// todo
export function isPreventDrop(component: any) {
  return !components.includes(component) && !component.startsWith("SVG");
}

export function getComponentRotatedStyle(style: any) {
  style = { ...style };
  if (style.rotate != 0) {
    const newWidth =
      style.width * cos(style.rotate) + style.height * sin(style.rotate);
    const diffX = (style.width - newWidth) / 2; // 旋转后范围变小是正值，变大是负值
    style.left += diffX;
    style.right = style.left + newWidth;

    const newHeight =
      style.height * cos(style.rotate) + style.width * sin(style.rotate);
    const diffY = (newHeight - style.height) / 2; // 始终是正
    style.top -= diffY;
    style.bottom = style.top + newHeight;

    style.width = newWidth;
    style.height = newHeight;
  } else {
    style.bottom = style.top + style.height;
    style.right = style.left + style.width;
  }

  return style;
}

const needUnit = [
  "fontSize",
  "width",
  "height",
  "top",
  "left",
  "borderWidth",
  "letterSpacing",
  "borderRadius",
];
export function getStyle(style: any, filter = []) {
  console.log(filter, "loo");
  const result = {};
  Object.keys(style).forEach((key) => {
    if (!filter.includes(key)) {
      if (key != "rotate") {
        if (style[key] !== "") {
          result[key] = style[key];

          if (needUnit.includes(key)) {
            result[key] += "px";
          }
        }
      } else {
        result.transform = key + "(" + style[key] + "deg)";
      }
    }
  });
  console.log("result", result);
  return result;
}

export function getShapeStyle(style) {
  console.log("style666", style);
  const result = {};
  ["width", "height", "top", "left", "rotate"].forEach((attr) => {
    if (attr != "rotate") {
      result[attr] = style[attr] + "px";
    } else {
      result.transform = "rotate(" + style[attr] + "deg)";
    }
  });

  return result;
}

export function mod360(deg: number) {
  return (deg + 360) % 360;
}

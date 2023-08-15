/**
 * 1. 外部组件的引入
 * 2. 外部的styles引入 使用styled-components
 * 3.
 */

function generateRandomString(length) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const chars = alphabet + alphabet.toUpperCase() + numbers;

  let result = "";
  for (let i = 0; i < length - 1; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 使用随机选择的字母开头
  result =
    alphabet.charAt(Math.floor(Math.random() * alphabet.length)) + result;

  return result;
}

const generatorComponent = async (ctx, next) => {
  const { componentData } = ctx.request.body;
  const UIDL = {
    name: "App",
    node: {
      type: "element",
      content: {
        elementType: "React.Fragment",
        children: [],
      },
    },
  };

  componentData.forEach((component) => {
    const childComponent = {};
    childComponent.type = "element";
    childComponent.content = {
      semanticType: component.component,
      elementType: component.component,
      name: generateRandomString(16),
      dependency: component.isLibrary
        ? {
            type: "package",
            path: "antd",
            version: "^5.6.3",
            meta: {
              namedImport: true,
              originalName: component.originalName,
            },
          }
        : {
            type: "local",
            path: `@/custom-components/${component.component}`,
          },
      style: { position: "absolute", ...component.style },
    };
    UIDL.node.content.children.push(childComponent);
  });

  ctx.request.body.UIDL = UIDL;
  await next();
};

export { generatorComponent };

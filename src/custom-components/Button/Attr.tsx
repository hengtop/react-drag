import React, { Fragment } from "react";

export default function Attr(props) {
  console.log("props", props);
  return (
    <div onClick={(e) => props.handleEvent("click", e)}>
      Attr
      {Object.keys(props.style).map((key) => {
        return (
          props.style[key] != null && (
            <Fragment key={key}>
              <span>{key}: </span>
              <input
                type="text"
                value={props.style[key]}
                onChange={(e) =>
                  props.handleEvent("input", { value: e.target.value, key })
                }
              />
              <br />
            </Fragment>
          )
        );
      })}
    </div>
  );
}

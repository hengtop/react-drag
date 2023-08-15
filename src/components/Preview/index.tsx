import React, { useCallback, useEffect, useState } from "react";

import { getStyle, createEvent, _ } from "@/utils";
import localforage from "localforage";
import { PreviewWrapper } from "./style";
import DynComponent from "../DynComponent";

export default function Index() {
  const [componentData, setComponentData] = useState([]);
  const handleGetComponentData = useCallback(
    _.debounce(() => {
      localforage.getItem("componentData", (error, value) => {
        console.log("666");
        if (!error) {
          setComponentData(value ?? []);
        }
      });
    }, 200),
    [setComponentData]
  );
  createEvent.addEventListener(
    "saveComponentData",
    handleGetComponentData,
    window.opener
  );
  useEffect(() => {
    localforage.getItem("componentData", (error, value) => {
      if (!error) {
        setComponentData(value ?? []);
      }
    });
    return () => {};
  }, []);

  return (
    <PreviewWrapper>
      {componentData.map((item) => {
        return (
          <DynComponent
            isLibrary={item.isLibrary}
            key={item.id}
            localSrc={item.componentPath}
            style={getStyle(item.style)}
          />
        );
      })}
    </PreviewWrapper>
  );
}

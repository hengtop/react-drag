import React, { Suspense } from "react";

export default function RightToolBar(props) {
  const { ComponentSlot } = props;
  return <div>{ComponentSlot}</div>;
}

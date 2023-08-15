import React, {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { LIBRARY_MAP } from "@/utils";

interface IDynComponentProps extends Record<string, unknown> {
  isLibrary?: boolean;
  localSrc: string;
}

const cache = new Map();

const DynComponent = memo((props: IDynComponentProps) => {
  //props/state
  const { isLibrary = false, localSrc, ...otherProps } = props;
  if (!cache.has(localSrc)) {
    /* @vite-ignore */
    const AsynComponent = lazy(
      isLibrary
        ? LIBRARY_MAP[localSrc]
        : () => import(/* @vite-ignore */ localSrc)
    );
    cache.set(localSrc, AsynComponent);
  }
  const AsynComponent = cache.get(localSrc);

  //redux hooks
  //other hooks
  //其他逻辑
  const handleEvent = useCallback(() => {}, []);
  return (
    <Suspense fallback={<div>lllloooad....</div>}>
      {AsynComponent && <AsynComponent {...otherProps} />}
    </Suspense>
  );
});

export default DynComponent;

import React, { useEffect, useRef } from "react";
import { CodeEditor } from "./style";

import ace from "ace-builds";
import "ace-builds/src-min-noconflict/theme-one_dark";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/mode-json5";
import "ace-builds/src-min-noconflict/ext-language_tools";

export default function Index(props) {
  const aceRef = useRef(null);
  const { code } = props;
  useEffect(() => {
    const editor = ace.edit(aceRef.current, {
      maxLines: 34,
      minLines: 34,
      fontSize: 14,
      theme: "ace/theme/one_dark",
      mode: "ace/mode/json5",
      tabSize: 4,
      readOnly: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    });

    editor.setValue(JSON.stringify(code, null, 4));
  }, [aceRef, code]);
  return <CodeEditor className="ace" ref={aceRef}></CodeEditor>;
}

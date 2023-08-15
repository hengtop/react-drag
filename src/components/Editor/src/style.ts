import styled from "@emotion/styled";

interface IEditorWrapperStyleProps {
  width?: number;
  height?: number;
}

export const EditorWrapper = styled.div`
  position: relative;
  width: ${(props: IEditorWrapperStyleProps) =>
    props.width ? props.width : 1200}px;
  height: ${(props: IEditorWrapperStyleProps) =>
    props.height ? props.height : 1200}px;

  .grid {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

export const ShapeWrapper = styled.div`
  position: absolute;

  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
  }
  .icon-xiangyouxuanzhuan {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    cursor: grab;
    color: #59c7f9;
    font-size: 20px;
    font-weight: 600;

    &:active {
      cursor: grabbing;
    }
  }
`;

export const MarkLineWrapper = styled.div`
  width: 100%;
  height: 100%;

  .line {
    background: #59c7f9;
    position: absolute;
    z-index: 9999;
  }

  .xline {
    width: 100%;
    height: 1px;
  }

  .yline {
    width: 1px;
    height: 100%;
  }
`;

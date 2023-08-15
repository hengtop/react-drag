import type { Draft, PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import { $, _, createEvent } from "@/utils";
import localforage from "localforage";
import { cloneDeep } from "lodash";

interface ICanvasStyleData {
  width: number;
  height: number;
  scale: number;
  color: string;
  opacity: number;
  background: string;
  fontSize: number;
}

interface IComponentDataItem {
  component: string;
  label: string;
  propValue: string;
  icon: string;
  style: Record<string, string | number>;
}

export interface IHomeState {
  value: number;
  editor: Element | null;
  canvasStyleData: ICanvasStyleData;
  componentData: IComponentDataItem[];
  curComponent: IComponentDataItem | null;
  curComponentIndex: number;
  areaData: any;
  isInEdiotr: boolean;
  isClickComponent: boolean;
  codeEditor: boolean;
  snapshotData: IComponentDataItem[][]; // 编辑器快照数据
  snapshotIndex: number; // 快照索引
  copyData: IComponentDataItem[];
}

const initialState: IHomeState = {
  value: 0,
  editor: null,
  componentData: [],
  canvasStyleData: {
    // 页面全局数据
    width: 1200,
    height: 740,
    scale: 100,
    color: "#000",
    opacity: 1,
    background: "#fff",
    fontSize: 14,
  },
  curComponent: null,
  curComponentIndex: 0,
  areaData: {
    // 选中区域包含的组件以及区域位移信息
    style: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
    components: [],
  },
  isClickComponent: false,
  isInEdiotr: false,
  codeEditor: false,
  snapshotData: [], // 编辑器快照数据
  snapshotIndex: -1, // 快照索引
  copyData: [],
};

export const HomeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    getEditor(state) {
      //state.editor = $('#editor') as Draft<Element | null>;
    },
    addComponent(
      state,
      action: PayloadAction<{ component: IComponentDataItem; index?: number }>
    ) {
      const { component, index } = action.payload;
      if (index !== undefined) {
        state.componentData.splice(index, 0, component);
      } else {
        state.componentData.push(component);
      }
      HomeSlice.caseReducers.saveComponentData(state);
    },
    setAreaData(state, { payload }: PayloadAction<{ data: any }>) {
      state.areaData = payload.data;
    },
    setClickComponentStatus(state, action: PayloadAction<boolean>) {
      state.isClickComponent = action.payload;
    },
    setInEditorStatus(state, action: PayloadAction<boolean>) {
      state.isInEdiotr = action.payload;
    },
    setShapeStyle(
      state,
      action: PayloadAction<{ top; left; width; height; rotate }>
    ) {
      const { curComponent, curComponentIndex } = state;
      const { top, left, width, height, rotate } = action.payload;
      if (top) curComponent.style.top = Math.round(top);
      if (left) curComponent.style.left = Math.round(left);
      if (width) curComponent.style.width = Math.round(width);
      if (height) curComponent.style.height = Math.round(height);
      if (rotate) curComponent.style.rotate = Math.round(rotate);
      HomeSlice.caseReducers.updateComponentDateItem(state, {
        curComponentIndex,
        curComponent,
      });
      //  state.componentData = state.componentData.map((item, index) => {
      //   if(index === curComponentIndex){
      //     return curComponent;
      //   } else {
      //     return item
      //   }
      // })
    },
    setShapeSingleStyle(
      state,
      action: PayloadAction<{ key: any; value: any }>
    ) {
      const { key, value } = action.payload;
      const { curComponent, curComponentIndex } = state;
      if (value == null) return;
      curComponent.style[key] = value;
      HomeSlice.caseReducers.updateComponentDateItem(state, {
        curComponentIndex,
        curComponent,
      });
    },
    setCurComponent(state, action: PayloadAction<{ component; index }>) {
      const { component, index } = action.payload;
      console.log(component, index);
      state.curComponent = state.componentData[index];
      state.curComponentIndex = index;
    },
    updateComponentDateItem(
      state,
      payload: { curComponentIndex: number; curComponent: IComponentDataItem }
    ) {
      const { curComponentIndex, curComponent } = payload;
      state.componentData = state.componentData.map((item, index) => {
        if (index === curComponentIndex) {
          return curComponent;
        } else {
          return item;
        }
      });
      // 保存
      HomeSlice.caseReducers.saveComponentData(state);
    },
    saveComponentData: (state) => {
      localforage.setItem("componentData", _.cloneDeep(state.componentData));
      createEvent.dispatchEvent("saveComponentData");
    },
    setCodeEditorShow(state, action: PayloadAction<boolean>) {
      state.codeEditor = action.payload;
    },
    undo(state) {
      if (state.snapshotIndex >= 0) {
        state.snapshotIndex--;
        const componentData =
          _.cloneDeep(state.snapshotData[state.snapshotIndex]) || [];
        if (state.curComponent) {
          // 如果当前组件不在 componentData 中，则置空
          const needClean = !componentData.find(
            (component) => state.curComponent.id === component.id
          );

          if (needClean) {
            setCurComponent({
              component: null,
              index: null,
            });
          }
        }
        state.componentData = componentData;
        HomeSlice.caseReducers.saveComponentData(state);
      }
    },
    redo(state) {
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++;
        state.componentData = _.cloneDeep(
          state.snapshotData[state.snapshotIndex]
        );
      }
    },
    recordSnapshot(state, payload?: unknown) {
      // 可以设置一个最大保存数量
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = _.cloneDeep(
        state.componentData
      );
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(
          0,
          state.snapshotIndex + 1
        );
      }
    },

    // 复制
    copy(state, payload?: unknown) {
      // 保存当前元素
      if (state.copyData.length >= 10) {
        state.copyData.shift();
      }
      state.copyData.push(state.curComponent);
    },
    // 粘贴
    paste(state, payload?: unknown) {
      const item = cloneDeep(state.copyData[state.copyData.length - 1]);
      console.log(item);
      item.id = item.id + "_cpoy";
      item.style.top += 10;
      item.style.left += 10;
      state.componentData.push(item);
      state.copyData.push(item);
      HomeSlice.caseReducers.saveComponentData(state);
    },

    deleteCom(state, payload) {
      state.componentData.splice(state.curComponentIndex, 1);
      HomeSlice.caseReducers.saveComponentData(state);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAreaData,
  getEditor,
  addComponent,
  setClickComponentStatus,
  setInEditorStatus,
  setShapeStyle,
  setCurComponent,
  setShapeSingleStyle,
  saveComponentData,
  setCodeEditorShow,
  redo,
  recordSnapshot,
  undo,
  copy,
  paste,
  deleteCom,
} = HomeSlice.actions;
export default HomeSlice.reducer;

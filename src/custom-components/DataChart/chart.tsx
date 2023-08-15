import * as echarts from "echarts";
import { useEffect, useRef, useState } from "react";
import { ChartWrapper } from "./style";
import { unstable_Blocker } from "react-router-dom";

type EChartsOption = echarts.EChartsOption;

export default function Chart(props: { option: EChartsOption }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(null);
  const [myChart, setMyChart] = useState<echarts.ECharts | null>(null);
  const [observerChartTime, setObserverChartTime] =
    useState<NodeJS.Timer | null>(null);
  const { option } = props;
  useEffect(() => {
    const myChart = chartRef.current && echarts.init(chartRef.current);
    setMyChart(myChart);
  }, []);

  useEffect(() => {
    let width: unknown, height: unknown;
    clearInterval(timeRef.current);
    timeRef.current = setInterval(() => {
      const curWidth = chartRef.current?.offsetWidth;
      const curHeight = chartRef.current?.offsetHeight;
      if (
        width != null &&
        height != null &&
        (width != curWidth || height != curHeight)
      ) {
        // 宽度变化了
        console.log("变化了");
        myChart?.resize();
      } else {
        console.log("没有变化");
      }
      width = curWidth;
      height = curHeight;
    }, 500);
    () => {
      clearInterval(timeRef.current);
    };
  }, [myChart]);

  useEffect(() => {
    option && myChart?.setOption(option);
  }, [option, myChart]);
  return <ChartWrapper ref={chartRef}></ChartWrapper>;
}

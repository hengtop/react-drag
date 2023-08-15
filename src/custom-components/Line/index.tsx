import Chart from "@/custom-components/DataChart/chart";
import { LineWrapper } from "./style";

export default function Line(props) {
  return (
    <LineWrapper {...props}>
      <Chart
        option={{
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: "line",
              areaStyle: {},
            },
          ],
        }}
      />
    </LineWrapper>
  );
}

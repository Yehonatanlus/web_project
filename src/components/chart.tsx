import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Series } from "@amcharts/amcharts5/.internal/core/render/Series";

function Chart(props) {

  const chartRef = useRef(null);

  const [currSeries, setCurrSeries] = useState(null);
  const [currLegend, setCurrLegend] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if(currSeries){
      currSeries.data.setAll(props.data);
      currLegend.data.setAll(currSeries.dataItems);
    }

  },[props.data]);

  useLayoutEffect(() => {
    if (!chartRef.current){
      chartRef.current = true;

      const root = am5.Root.new("chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);
      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 270,
          radius: am5.percent(70),
          layout: root.horizontalLayout,
          centerY: am5.percent(50),
          centerX: am5.percent(50),
          y: am5.percent(50),
          x: am5.percent(50),
        })
      );
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          endAngle: 270,
          legendValueText: ": {value}"
        })
      );

      series.states.create("hidden", {
        endAngle: -90,
      });

      series.data.setAll([
        { value: 10, category: "One" },
        { value: 9, category: "Two" },
        { value: 6, category: "Three" },
        { value: 5, category: "Four" },
        { value: 4, category: "Five" },
        { value: 3, category: "Six" },
        { value: 1, category: "Seven" },
      ]);
      // series.data.setAll([props.chartData]);
      series.appear(1000, 100);

      // Add legend
      const legend = chart.children.push(am5.Legend.new(root, {
        centerY: am5.percent(50),
        centerX: am5.percent(80),
        y: am5.percent(50),
        x: am5.percent(80),
        layout: root.verticalLayout,
      }));

      legend.data.setAll(series.dataItems);

      setCurrSeries(series);
      setCurrLegend(legend);
    }
  },[props]);

  return <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>;
}
export default Chart;

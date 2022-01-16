import React, { useRef, useEffect, useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart() {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
        radius: am5.percent(70),
      })
    );
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270,
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

    series.appear(1000, 100);
  },[]);

  return <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>;
}
export default Chart;

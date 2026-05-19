import React from "react";
import "./DataChart.css";

const defaultItems = [
  { label: "ITEM 1", year2010: 78, year2020: 45 },
  { label: "ITEM 2", year2010: 60, year2020: 32 },
  { label: "ITEM 3", year2010: 40, year2020: 20 },
  { label: "ITEM 4", year2010: 26, year2020: 14 },
  { label: "ITEM 5", year2010: 12, year2020: 0 },
];

const DataChart = ({
  heading = "Data heading",
  subheading = "Sub heading",
  items = defaultItems,
}) => {
  return (
    <section className="data-chart" aria-label="Data chart">
      <h3 className="data-chart__heading">{heading}</h3>
      <p className="data-chart__subheading">{subheading}</p>

      <div
        className="data-chart__bars"
        role="img"
        aria-label="Comparison bars for 2010 and 2020"
      >
        {items.map((item) => (
          <div className="data-chart__bar-group" key={item.label}>
            <div className="data-chart__track">
              <div
                className="data-chart__bar data-chart__bar--2010"
                style={{ height: `${item.year2010}%` }}
              />
              <div
                className="data-chart__bar data-chart__bar--2020"
                style={{ height: `${item.year2020}%` }}
              />
            </div>
            <span className="data-chart__label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="data-chart__legend" aria-hidden="true">
        <span className="data-chart__legend-item">
          <span className="data-chart__dot data-chart__dot--2010" />
          2010
        </span>
        <span className="data-chart__legend-item">
          <span className="data-chart__dot data-chart__dot--2020" />
          2020
        </span>
      </div>
    </section>
  );
};

export default DataChart;

"use client";
import clsx from "clsx";
import { Cell, Pie, PieChart } from "recharts";
import React from "react";
interface CircularProgressProps {
  step: number;
  max: number;
  className?: string;
}

/**
 * CircularProgress Component
 *
 * This component renders a circular progress indicator using a PieChart from Recharts.
 * It takes the current step, a maximum value, and an optional className as props to
 * dynamically show the percentage of progress completed. The chart consists of two
 * main parts: the completed score and the remaining progress.
 *
 * Props:
 * - step: The current step value or progress made.
 * - max: The maximum value or target to be achieved.
 * - className: Optional additional className for custom styling.
 *
 * @param {CircularProgressProps} props - Contains the `step`, `max`, and `className`.
 * @returns {React.FC} - A React functional component rendering a circular progress chart.
 */
const CircularProgress: React.FC<CircularProgressProps> = ({
  step,
  max,
  className,
}) => {
  const TOTAL_SCORE = 1000; // Total score used for progress calculation

  // Calculate the completed progress based on the current step and max value.
  const data = [{ name: "Score", value: (1000 / max) * step, fill: "#9244D4" }];

  // Calculate the remaining progress to complete the circular chart.
  const remaining = TOTAL_SCORE - data[0].value;

  // Combine completed progress and remaining progress into a single dataset.
  const newData = [
    ...data,
    { value: remaining, name: "Remaining", fill: "#e3e3e3" },
  ];
  const [chartId, setChartId] = React.useState("");
  React.useEffect(() => {
    setChartId(`chart-${Math.random().toString(36).substr(2, 9)}`);
  }, []);
  const [isClient, setIsClient] = React.useState(false);

  // Ensures that the component only renders after client-side hydration
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    /**
     * PieChart:
     * A circular chart that represents the progress visually.
     * The width and height control the size, and clsx is used to conditionally add
     * additional classNames for custom styling if provided.
     */
    <PieChart
      id={chartId}
      width={55}
      height={56}
      className={clsx(["", className])}
    >
      {/* Pie component creates the circular progress using the newData array */}
      <Pie
        data={newData} // The combined data with completed and remaining values
        startAngle={90} // Start angle for progress circle
        autoReverse // Reverses the pie slices automatically
        endAngle={-270} // End angle to complete the 360-degree circle
        innerRadius={14} // Inner radius to create a doughnut shape
        outerRadius={20} // Outer radius for overall size of the progress circle
        fill="#000000" // Default fill color (can be overridden by data)
        dataKey="value" // Key for accessing the value from data for charting
      >
        {/* Render each cell in the Pie chart (progress and remaining) */}
        {newData.map((d, i) => (
          <Cell key={`index-${i}`} fill={d.fill} stroke="none" /> // Define color and remove border stroke
        ))}
      </Pie>
    </PieChart>
  );
};

export default CircularProgress;

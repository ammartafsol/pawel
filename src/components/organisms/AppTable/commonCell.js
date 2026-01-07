"use client";

import moment from "moment";

/**
 * RenderDate component for displaying formatted dates in table cells
 * @param {string|Date} date - The date to display
 * @param {string} format - Optional date format (default: "MMM DD, YYYY")
 * @returns {JSX.Element}
 */
export function RenderDate({ date, format = "MMM DD, YYYY" }) {
  if (!date) {
    return <span>N/A</span>;
  }

  const formattedDate = moment(date).format(format);

  return <span>{formattedDate}</span>;
}


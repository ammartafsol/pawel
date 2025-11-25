"use client";
import React from "react";
import classes from "./Calender.module.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const Calender = ({events=[], className=""}) => {
  const localizer = momentLocalizer(moment);
 

  return (
    <div className={`${classes.calenderContainer} ${className}`}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        selectable={true}
        onSelectEvent={() => {
          console.log("event selected");
        }}
      />
    </div>
  );
};

export default Calender;

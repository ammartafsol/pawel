"use client";
import React from "react";
import classes from "./Calender.module.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const Calender = ({
  events = [],
  className = "",
  onView,
  onNavigate,
  view,
  date,
  onSelectEvent,
}) => {
  const localizer = momentLocalizer(moment);

  console.log("events in calender", events);

  return (
    <div className={`${classes.calenderContainer} ${className}`}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "day"]}
        view={view}
        date={date}
        onView={onView}
        onNavigate={onNavigate}
        selectable={true}
        onSelectEvent={onSelectEvent || (() => {
          console.log("event selected");
        })}
      />
    </div>
  );
};

export default Calender;

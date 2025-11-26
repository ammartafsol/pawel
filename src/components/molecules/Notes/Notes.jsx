import React from "react";
import classes from "./Notes.module.css";
import { RxDotsVertical } from "react-icons/rx";

const Notes = () => {
  return (
    <div className={classes.notesWrapper}>
      <div className={classes.notesContainer}>
        <div className={classes.notesHeader}>
          <h4>Notes</h4>
          <RxDotsVertical cursor={"pointer"} size={24} color="#0D93FF" />
        </div>
        <p>
          Figma ipsum component variant main layer. Boolean plugin project
          comment subtract figjam editor arrange frame team.
        </p>
        <div className={classes.notesFooter}>
            <h6>12/29/2023</h6>
            <p>10:20</p>
        </div>
      </div>
    </div>
  );
};

export default Notes;

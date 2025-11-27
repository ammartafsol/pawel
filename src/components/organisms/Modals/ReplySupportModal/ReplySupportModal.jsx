import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./ReplySupportModal.module.css";

const ReplySupportModal = ({ show, setShow, clientName = "Herman Schoen" }) => {
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading={`Reply to ${clientName}`}
      showCloseIcon={true}
      drawer={true}
      modalMainClass={classes.modalMain}
    >
      <div className={classes.mainContainer}>
        {/* Content will be added later */}
      </div>
    </ModalSkeleton>
  );
};

export default ReplySupportModal;

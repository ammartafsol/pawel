import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./ReplySupportModal.module.css";
import { CgFileDocument } from "react-icons/cg";
import { TextArea } from "@/components/atoms/TextArea/TextArea";

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
        <div className={classes.labelDiv}>
            <CgFileDocument color="var(--grey-icon2)" size={24}/>
            <h4 className={classes.title}>Message</h4>
        </div>
        <TextArea placeholder="Add message here..." />
      </div>
    </ModalSkeleton>
  );
};

export default ReplySupportModal;

import React, { useState } from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import classes from "./GenerateTicketModal.module.css";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { ticketIssues } from "@/developementContent/Enums/enum";

const GenerateTicketModal = ({ show, setShow }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading="Generate Ticket"
      showCloseIcon={true}
      footerClass={classes.footerContainer}
      footerData={
        <Button
          variant="outlined"
          label="Send Message"
          className={classes.sendMessageButton}
        />
      }
    >
      <div className={classes.mainContainer}>
        <div className={classes.headingContainer}>
          <div className={classes.imageContainer}>
            <Image src={"/app-images/ticket.png"} fill alt="logo" />
          </div>
          <h4>How we can help you?</h4>
        </div>
        <div className={classes.dropdownContainer}>
          <DropDown
            options={ticketIssues}
            values={selectedIssue?selectedIssue:[]}
            placeholder="Select an issue"
            onChange={(e) => {
              setSelectedIssue(e);
            }}
            label={"I have issue with "}
          />
          {
            selectedIssue && (
              <TextArea placeholder="Please briefly describe your issue here..." />
            )
          }
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default GenerateTicketModal;

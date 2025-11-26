"use client";
import React, { useState } from "react";
import classes from "./SupportCenterTemplate.module.css";
import BreadComTop from "@/components/atoms/BreadComTop/BreadComTop";
import Button from "@/components/atoms/Button";
import GenerateTicketModal from "@/components/organisms/Modals/GenerateTicketModal/GenerateTicketModal";

const SupportCenterTemplate = () => {
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  return (
    <div>
      <BreadComTop />
      <div className={classes.supportCenterContainer}>
        <h4>Your Help Requests</h4>
        <div className={classes?.supportCenterWrapper}>
          <div className={classes?.supportCenterWrapperContent}>
            <h4>You don't currently have any open requests.</h4>
            <p>Need help? — we're here for you.</p>
          </div>
        </div>
        <Button 
          label="Send us a message" 
          variant="outlined" 
          className={classes?.sendMessageButton}
          onClick={() => setShowSendMessageModal(true)}
        />
      </div>
      <GenerateTicketModal show={showSendMessageModal} setShow={setShowSendMessageModal} />
    </div>
  );
};

export default SupportCenterTemplate;

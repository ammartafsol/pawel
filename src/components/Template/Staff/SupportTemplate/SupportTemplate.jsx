'use client'
import React, { useState } from 'react';
import classes from "./SupportTemplate.module.css";
import ReplySupportModal from "@/components/organisms/Modals/ReplySupportModal/ReplySupportModal";

const SupportTemplate = () => {
  const [showReplyModal, setShowReplyModal] = useState(true);

  return (
    <div className={classes.container}>
      <div>SupportTemplate</div>
      <ReplySupportModal 
        show={showReplyModal} 
        setShow={setShowReplyModal}
      />
    </div>
  )
}

export default SupportTemplate
"use client";
import Button from "@/components/atoms/Button";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { FaRegFolderClosed } from "react-icons/fa6";
import classes from "./CaseManagementDetailTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import EvidenceTableTop from "@/components/molecules/EvidenceTableTop/EvidenceTableTop";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";

const CaseManagementDetailTemplate = ({ slug }) => {
    const [selectedValue, setSelectedValue] = useState(auditTrackingOptions[0]);
  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.backButtonContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack color="#151529" />}
              label="Back"
            />
          </div>
        }
      >
        <div className={classes?.content}>
          <Row>
            <Col md={3}></Col>
            <Col md={9}>
              <Wrapper headerComponent={<EvidenceTableTop title="Audit Tracking" placeholder="Select..." selectedValue={selectedValue} options={auditTrackingOptions}  setSelectedValue={setSelectedValue} />}>
              <Calender events={myEventsList}/>
              </Wrapper>

              {/* note card */}
            </Col>
          </Row>
        </div>
      </Wrapper>
    </div>
  );
};

export default CaseManagementDetailTemplate;

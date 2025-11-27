"use client";
import React, { useState } from "react";
import classes from "./CreateNewCaseModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import { FaUser } from "react-icons/fa6";
import Input from "@/components/atoms/Input/Input";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { MdOutlineAssignment } from "react-icons/md";
import { IoMdKey } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaBalanceScale, FaRegUserCircle } from "react-icons/fa";
import { IoAddCircle, IoCalendarClearOutline, IoSearchSharp } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import Button from "@/components/atoms/Button";

const CreateNewCaseModal = ({ show, setShow }) => {
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  return (
    <div>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        heading="Create New Case"
        showCloseIcon={true}
        drawer={true}
        modalMainClass={classes.modalMain}
        footerClass={classes.footerClass}
        footerData={
          <div className={classes.footerDiv}>
            <Button 
              label="" 
              variant="outlined" 
              leftIcon={<RiDeleteBinLine color="var(--red)" size={24}/>}
            />
            <Button 
              label="Create Case" 
              variant="outlined" 
              leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
            />
          </div>
        }
      >
        <div className={classes.iconInputContainer}>
          <IconInput
            icon={<MdOutlineAssignment size={22} />}
            title="Type of Case"
          >
            <DropDown
              options={[]}
              placeholder="Select Case Type"
              values={[]}
              className={classes.dropdown}
              onChange={(e) => {}}
            />
          </IconInput>
          <IconInput icon={<FaUser size={22} />} title="Client Name">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
            />
          </IconInput>
          <IconInput icon={<IoMdKey size={22} />} title="Reference">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
            />
          </IconInput>
          <IconInput
            icon={<AiOutlineCheckCircle size={22} />}
            title="Trademark Name/No."
          >
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
            />
          </IconInput>
          <IconInput icon={<FaBalanceScale size={22} />} title="Jurisdiction">
            <DropDown
              options={[]}
              placeholder="Select"
              values={[]}
              className={classes.dropdown}
              onChange={(e) => {}}
            />
          </IconInput>
          <IconInput
            icon={<IoCalendarClearOutline size={22} />}
            title="Deadlines"
            className={classes?.iconParent}
          >
            <div className={classes?.deadlineContainer}>
              <Input type="date" />
              <Input
                placeholder="Deadline Title"
                className={classes?.input}
                inputClass={classes?.inputClassName}
              />
              <Button
                label="Add new deadline"
                className={classes?.addDeadlineButton}
                variant="outlined"
                leftIcon={<IoAddCircle color="#5C5C5C" size={25} />}
              />
            </div>
          </IconInput>
          <hr />
          <div>
            <IconInput
              icon={<FaRegUserCircle size={22} />}
              title="Assign Staff"
              className={classes?.iconParent}
            >
              <div className={classes?.deadlineContainer}>
                <Input
                  placeholder="Type to search"
                  className={classes?.input}
                  label="primary"
                  inputClass={classes?.inputClassName}
                  type="search"
                  rightIcon={<IoSearchSharp size={20} />}
                />
                <Input
                  placeholder="Type to search"
                  className={classes?.input}
                  label="secondary"
                  inputClass={classes?.inputClassName}
                  type="search"
                  rightIcon={<IoSearchSharp size={20} />}
                />
                
              </div>
            </IconInput>
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default CreateNewCaseModal;

"use client";
import React from "react";
import classes from "./AddNoteModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import Input from "@/components/atoms/Input/Input";
import { MdKey, MdOutlineNotes } from "react-icons/md";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { GrDocumentText } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import Button from "@/components/atoms/Button";

const AddNoteModal = ({ show, setShow }) => {
  return (
    <ModalSkeleton 
      heading={"Add a note"} 
      show={show} 
      setShow={setShow}
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
            label="Add Note" 
            variant="outlined" 
            leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
          />
        </div>
      }
    >
      <div className={classes.iconInputContainer}>
        <IconInput title={"Note Title"} icon={<MdOutlineNotes size={22} />}>
          <Input
            className={classes.input}
            inputClass={classes.inputClassName}
            placeholder="Type here..."
          />
        </IconInput>
        <div>
          <div className={classes.descriptionContainer}>
            <GrDocumentText size={22} />
            <div className={classes.descriptionText}>Description</div>
          </div>
          <TextArea placeholder="Add note points..." />
        </div>
        <IconInput title={"Permissible"} icon={<MdKey size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={[]}
            placeholder="Select"
            values={[]}
            onChange={(e) => {}}
          />
        </IconInput>
      </div>
    </ModalSkeleton>
  );
};

export default AddNoteModal;

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
import { useFormik } from "formik";
import { AddNoteSchema } from "@/formik/schema";
import { addNoteFormValues } from "@/formik/initialValues";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";

const AddNoteModal = ({ show, setShow }) => {
  const formik = useFormik({
    initialValues: addNoteFormValues,
    validationSchema: AddNoteSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    console.log("Form submitted:", values);
    // Add your API call here
    // setShow(false);
  };

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
            onClick={() => {
              formik.resetForm();
              setShow(false);
            }}
          />
          <Button 
            label="Add Note" 
            variant="outlined" 
            leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
            onClick={() => formik.handleSubmit()}
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
            value={formik.values.noteTitle}
            setValue={(value) => formik.setFieldValue("noteTitle", value)}
            error={formik.touched.noteTitle && formik.errors.noteTitle}
          />
        </IconInput>
        <div>
          <div className={classes.descriptionContainer}>
            <GrDocumentText size={22} />
            <div className={classes.descriptionText}>Description</div>
          </div>
          <TextArea 
            placeholder="Add note points..." 
            value={formik.values.description}
            setValue={(value) => formik.setFieldValue("description", value)}
            error={formik.touched.description && formik.errors.description}
          />
        </div>
        <IconInput title={"Permissible"} icon={<MdKey size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={auditTrackingOptions}
            placeholder="Select"
            values={formik.values.permissible ? auditTrackingOptions.filter(opt => opt.value === formik.values.permissible) : []}
            closeOnSelect={true}
            onChange={(value) => {
              const selectedValue = value && value.length > 0 ? value[0]?.value : "";
              formik.setFieldValue("permissible", selectedValue);
            }}
          />
          {formik.touched.permissible && formik.errors.permissible && (
            <div className={classes.errorText}>{formik.errors.permissible}</div>
          )}
        </IconInput>
      </div>
    </ModalSkeleton>
  );
};

export default AddNoteModal;

"use client";
import React from "react";
import classes from "./CreateNewCaseModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import { FaUser } from "react-icons/fa6";
import Input from "@/components/atoms/Input/Input";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { MdOutlineAssignment } from "react-icons/md";
import { IoMdKey, IoMdCheckmark } from "react-icons/io";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaBalanceScale, FaRegUserCircle } from "react-icons/fa";
import { IoAddCircle, IoCalendarClearOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import Button from "@/components/atoms/Button";
import { useFormik } from "formik";
import { CreateNewCaseSchema } from "@/formik/schema";
import { createNewCaseFormValues } from "@/formik/initialValues";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";

// Staff options for dropdown
const staffOptions = [
  { label: "Roxanne Gleichner", value: "roxanne-gleichner" },
  { label: "John Doe", value: "john-doe" },
  { label: "Jane Smith", value: "jane-smith" },
  { label: "Michael Johnson", value: "michael-johnson" },
  { label: "Sarah Williams", value: "sarah-williams" },
];

const CreateNewCaseModal = ({ show, setShow }) => {
  const formik = useFormik({
    initialValues: createNewCaseFormValues,
    validationSchema: CreateNewCaseSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    console.log("Form submitted:", values);
    // Add your API call here
    // setShow(false);
  };

  const handleAddDeadline = () => {
    const newDeadlines = [...formik.values.deadlines, { title: "", internalDeadline: "", officeDeadline: "" }];
    formik.setFieldValue("deadlines", newDeadlines);
  };

  const handleRemoveDeadline = (index) => {
    const newDeadlines = formik.values.deadlines.filter((_, i) => i !== index);
    formik.setFieldValue("deadlines", newDeadlines);
  };

  const handleDeadlineChange = (index, field, value) => {
    const newDeadlines = [...formik.values.deadlines];
    newDeadlines[index] = { ...newDeadlines[index], [field]: value };
    formik.setFieldValue("deadlines", newDeadlines);
  };

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
              onClick={()=>{formik.resetForm();setShow(false);}}
              leftIcon={<RiDeleteBinLine color="var(--red)" size={24}/>}
            />
            <Button 
              label="Create Case" 
              variant="outlined" 
              leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
              onClick={() => formik.handleSubmit()}
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
              options={auditTrackingOptions}
              placeholder="Select Case Type"
              values={formik.values.caseType ? auditTrackingOptions.filter(opt => opt.value === formik.values.caseType) : []}
              className={classes.dropdown}
              closeOnSelect={true}
              onChange={(value) => {
                const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                formik.setFieldValue("caseType", selectedValue);
              }}
            />
            {formik.touched.caseType && formik.errors.caseType && (
              <div className={classes.errorText}>{formik.errors.caseType}</div>
            )}
          </IconInput>
          <IconInput icon={<FaUser size={22} />} title="Client Name">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.clientName}
              setValue={(value) => formik.setFieldValue("clientName", value)}
              error={formik.touched.clientName && formik.errors.clientName}
            />
          </IconInput>
          <IconInput icon={<IoMdKey size={22} />} title="Reference">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.reference}
              setValue={(value) => formik.setFieldValue("reference", value)}
              error={formik.touched.reference && formik.errors.reference}
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
              value={formik.values.trademarkName}
              setValue={(value) => formik.setFieldValue("trademarkName", value)}
              error={formik.touched.trademarkName && formik.errors.trademarkName}
            />
          </IconInput>
            <IconInput icon={<FaBalanceScale size={22} />} title="Jurisdiction">
              <DropDown
                options={auditTrackingOptions}
                placeholder="Select"
                values={formik.values.jurisdiction ? auditTrackingOptions.filter(opt => opt.value === formik.values.jurisdiction) : []}
                className={classes.dropdown}
                closeOnSelect={true}
                onChange={(value) => {
                  const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                  formik.setFieldValue("jurisdiction", selectedValue);
                }}
              />
            {formik.touched.jurisdiction && formik.errors.jurisdiction && (
              <div className={classes.errorText}>{formik.errors.jurisdiction}</div>
            )}
          </IconInput>
          <IconInput
            icon={<IoCalendarClearOutline size={22} />}
            title="Deadlines"
            className={classes?.iconParent}
          >
            <div className={classes?.deadlineContainer}>
              {formik.values.deadlines.map((deadline, index) => (
                <div key={`deadline-${index}-${deadline.title || deadline.internalDeadline || deadline.officeDeadline || index}`} className={classes.deadlineItem}>
                  <Input
                    placeholder="Deadline Title"
                    className={classes?.input}
                    inputClass={classes?.inputClassName}
                    value={deadline.title}
                    setValue={(value) => handleDeadlineChange(index, "title", value)}
                    error={formik.touched.deadlines?.[index]?.title && formik.errors.deadlines?.[index]?.title}
                  />
                  <Input 
                    type="date" 
                    className={classes?.input}
                    inputClass={classes?.inputClassName}
                    value={deadline.internalDeadline}
                    setValue={(value) => handleDeadlineChange(index, "internalDeadline", value)}
                    error={formik.touched.deadlines?.[index]?.internalDeadline && formik.errors.deadlines?.[index]?.internalDeadline}
                    label="Internal Deadline"
                  />
                  <Input 
                    type="date" 
                    className={classes?.input}
                    inputClass={classes?.inputClassName}
                    value={deadline.officeDeadline}
                    setValue={(value) => handleDeadlineChange(index, "officeDeadline", value)}
                    error={formik.touched.deadlines?.[index]?.officeDeadline && formik.errors.deadlines?.[index]?.officeDeadline}
                    label="Office Deadline"
                  />
                  {formik.values.deadlines.length > 1 && (
                    <Button
                      label=""
                      variant="outlined"
                      leftIcon={<RiDeleteBinLine color="var(--red)" size={20} />}
                      onClick={() => handleRemoveDeadline(index)}
                      className={classes.removeDeadlineButton}
                    />
                  )}
                </div>
              ))}
              <Button
                label="Add new deadline"
                className={classes?.addDeadlineButton}
                variant="outlined"
                leftIcon={<IoAddCircle color="#5C5C5C" size={25} />}
                onClick={handleAddDeadline}
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
                <div>
                  <div className={classes.staffLabel}>Primary</div>
                  <DropDown
                    options={staffOptions}
                    placeholder="Select Primary Staff"
                    values={formik.values.primaryStaff ? staffOptions.filter(opt => opt.value === formik.values.primaryStaff) : []}
                    className={classes.dropdown}
                    closeOnSelect={true}
                    searchable={true}
                    onChange={(value) => {
                      const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                      formik.setFieldValue("primaryStaff", selectedValue);
                      formik.setFieldTouched("primaryStaff", true);
                    }}
                    onDropdownClose={() => {
                      formik.setFieldTouched("primaryStaff", true);
                    }}
                  />
                  {formik.touched.primaryStaff && formik.errors.primaryStaff && (
                    <div className={classes.errorText}>{formik.errors.primaryStaff}</div>
                  )}
                </div>
                <div>
                  <div className={classes.staffLabel}>Secondary</div>
                  <DropDown
                    options={staffOptions}
                    placeholder="Select Secondary Staff (Optional)"
                    values={formik.values.secondaryStaff ? staffOptions.filter(opt => opt.value === formik.values.secondaryStaff) : []}
                    className={classes.dropdown}
                    closeOnSelect={true}
                    searchable={true}
                    onChange={(value) => {
                      const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                      formik.setFieldValue("secondaryStaff", selectedValue);
                    }}
                  />
                </div>
              </div>
            </IconInput>
          </div>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default CreateNewCaseModal;

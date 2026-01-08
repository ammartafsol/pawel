"use client";
import React, { useState, useEffect } from "react";
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
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";

const CreateNewCaseModal = ({ show, setShow, onCaseCreated, caseSlug, isUpdateMode = false }) => {
  const { Get, Post, Patch } = useAxios();
  const [jurisdictions, setJurisdictions] = useState([]);
  const [jurisdictionOptions, setJurisdictionOptions] = useState([]);
  const [caseTypeOptions, setCaseTypeOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [loadingCaseDetails, setLoadingCaseDetails] = useState(false);
  const [initialDeadlineCount, setInitialDeadlineCount] = useState(0);

  const formik = useFormik({
    initialValues: createNewCaseFormValues,
    enableReinitialize: true,
    validationSchema: isUpdateMode ? undefined : CreateNewCaseSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // Fetch case details when modal opens in update mode
  useEffect(() => {
    if (show && isUpdateMode && caseSlug) {
      // Initialize with empty deadline when opening in update mode
      formik.setFieldValue("deadlines", [{ internalDeadline: "", officeDeadline: "" }]);
      fetchCaseDetails();
      // Fetch all data needed to display in update mode
      fetchJurisdictions();
      fetchClients();
      fetchStaff();
    } else if (show && !isUpdateMode) {
      fetchJurisdictions();
      fetchClients();
      fetchStaff();
    } else {
      // Reset form when modal closes
      formik.resetForm();
      setCaseTypeOptions([]);
      setCaseDetails(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, isUpdateMode, caseSlug]);

  // Update form when case details are loaded
  useEffect(() => {
    if (caseDetails && isUpdateMode && !loadingCaseDetails && jurisdictions.length > 0) {
      const jurisdictionId = typeof caseDetails.jurisdiction === 'string' 
        ? caseDetails.jurisdiction 
        : caseDetails.jurisdiction?._id || "";
      const caseTypeId = typeof caseDetails.type === 'string' 
        ? caseDetails.type 
        : caseDetails.type?._id || "";

      const formattedDeadlines = caseDetails.deadlines && Array.isArray(caseDetails.deadlines) && caseDetails.deadlines.length > 0
        ? caseDetails.deadlines.map(d => {
            let internalDeadline = "";
            let officeDeadline = "";
            
            if (d.deadline) {
              try {
                const date = new Date(d.deadline);
                if (!Number.isNaN(date.getTime())) {
                  internalDeadline = date.toISOString().split('T')[0];
                }
              } catch (e) {
                console.error("Error parsing deadline:", e);
              }
            }
            
            if (d.officeActionDeadline) {
              try {
                const date = new Date(d.officeActionDeadline);
                if (!Number.isNaN(date.getTime())) {
                  officeDeadline = date.toISOString().split('T')[0];
                }
              } catch (e) {
                console.error("Error parsing officeActionDeadline:", e);
              }
            }
            
            return { internalDeadline, officeDeadline };
          })
        : [{ internalDeadline: "", officeDeadline: "" }];

      setInitialDeadlineCount(formattedDeadlines.length);

      formik.setValues({
        jurisdiction: jurisdictionId,
        caseType: caseTypeId,
        clientName: caseDetails.client?._id || "",
        reference: caseDetails.reference || "",
        trademarkName: caseDetails.trademarkName || "",
        trademarkNumber: caseDetails.trademarkNumber || "",
        primaryStaff: caseDetails.primaryStaff?._id || "",
        secondaryStaff: caseDetails.secondaryStaff?._id || "",
        deadlines: formattedDeadlines,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDetails, isUpdateMode, loadingCaseDetails, jurisdictions]);

  const fetchCaseDetails = async () => {
    if (!caseSlug) return;
    
    setLoadingCaseDetails(true);
    try {
      const { response } = await Get({
        route: `case/detail/${caseSlug}`,
        showAlert: false,
      });
      
      if (response?.status === "success" && response.data) {
        setCaseDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setLoadingCaseDetails(false);
    }
  };

  // Update case types when jurisdiction changes
  useEffect(() => {
    if (formik.values.jurisdiction && jurisdictions.length > 0) {
      const selectedJurisdiction = jurisdictions.find(
        (j) => j._id === formik.values.jurisdiction
      );
      const currentCaseTypeId = isUpdateMode && caseDetails?.type
        ? (typeof caseDetails.type === 'string' ? caseDetails.type : caseDetails.type?._id)
        : formik.values.caseType;
      
      if (selectedJurisdiction?.caseTypes) {
        let options = selectedJurisdiction.caseTypes
          .filter((ct) => ct.status === "active")
          .map((caseType) => ({
            label: caseType.name,
            value: caseType._id,
          }));
        
        if (isUpdateMode && currentCaseTypeId && !options.find(opt => opt.value === currentCaseTypeId)) {
          const currentCaseTypeName = typeof caseDetails?.type === 'object' 
            ? caseDetails.type?.name 
            : "Current Case Type";
          options = [{
            label: currentCaseTypeName,
            value: currentCaseTypeId,
          }, ...options];
        }
        
        setCaseTypeOptions(options);
      } else if (isUpdateMode && currentCaseTypeId) {
        const currentCaseTypeName = typeof caseDetails?.type === 'object' 
          ? caseDetails.type?.name 
          : "Current Case Type";
        setCaseTypeOptions([{
          label: currentCaseTypeName,
          value: currentCaseTypeId,
        }]);
      } else {
        setCaseTypeOptions([]);
      }
      
      if (!isUpdateMode) {
        formik.setFieldValue("caseType", "");
      }
    } else {
      setCaseTypeOptions([]);
      if (!isUpdateMode) {
        formik.setFieldValue("caseType", "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.jurisdiction, jurisdictions, isUpdateMode, caseDetails]);

  const fetchJurisdictions = async () => {
    setLoading(true);
  
      const { response } = await Get({
        route: "jurisdiction/all?search=&page=1&limit=10&status=",
        showAlert: false,
      });

      if (response?.status === "success" && response.data) {
        setJurisdictions(response.data);
        // Transform jurisdictions to dropdown options format
        const options = response.data
          .map((jurisdiction) => ({
            label: jurisdiction.name,
            value: jurisdiction._id,
          }));
        setJurisdictionOptions(options);
      }
      setLoading(false);
  };

  const fetchClients = async () => {
    setLoadingClients(true);
    const { response } = await Get({
      route: "users?role=client",
      showAlert: false,
    });

    if (response) {
      // Transform clients to dropdown options format
      const options = response.data
        .map((client) => ({
          label: client.fullName,
          value: client._id,
        }));
      setClientOptions(options);
    }
    setLoadingClients(false);
  };

  const fetchStaff = async () => {
    setLoadingStaff(true);
    const { response } = await Get({
      route: "users?role=staff",
      showAlert: false,
    });

    if (response) {
      // Transform staff to dropdown options format
      const options = response.data
        .map((staff) => ({
          label: staff.fullName,
          value: staff._id,
        }));
      setStaffOptions(options);
    }
    setLoadingStaff(false);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    
    if (isUpdateMode) {
      // Update mode: only update deadlines
      const payload = {
        deadlines: values.deadlines
          .filter(d => d.internalDeadline || d.officeDeadline) // Only include non-empty deadlines
          .map((deadline) => ({
            deadline: deadline.internalDeadline ? new Date(deadline.internalDeadline).toISOString() : undefined,
            officeActionDeadline: deadline.officeDeadline ? new Date(deadline.officeDeadline).toISOString() : undefined,
          }))
          .filter(d => d.deadline || d.officeActionDeadline), // Remove completely empty deadlines
      };

      const { response } = await Patch({
        route: `case/update/${caseSlug}`,
        data: payload,
        showAlert: true,
      });

      if (response) {
        RenderToast({type: "success", message: "Deadlines updated successfully"});
        setShow(false);
        // Call the callback to refresh the case data
        if (onCaseCreated) {
          onCaseCreated();
        }
      }
    } else {
      // Create mode: create new case
      const payload = {
        jurisdiction: values.jurisdiction,
        type: values.caseType,
        client: values.clientName,
        primaryStaff: values.primaryStaff,
        secondaryStaff: values.secondaryStaff || undefined,
        trademarkName: values.trademarkName,
        trademarkNumber: values.trademarkNumber,
        deadlines: values.deadlines.map((deadline) => ({
          deadline: new Date(deadline.internalDeadline).toISOString(),
          officeActionDeadline: new Date(deadline.officeDeadline).toISOString(),
        })),
      };

      // Remove undefined fields
      if (!payload.secondaryStaff) {
        delete payload.secondaryStaff;
      }

      const { response } = await Post({
        route: "case/create",
        data: payload,
        showAlert: true,
      });

      if (response) {
        formik.resetForm();
        setCaseTypeOptions([]);
        RenderToast({type: "success", message: "Case created successfully"});
        setShow(false);
        // Call the callback to refresh the case list
        if (onCaseCreated) {
          onCaseCreated();
        }
      }
    }
    setSubmitting(false);
  };

  const handleAddDeadline = () => {
    const newDeadlines = [...formik.values.deadlines, { internalDeadline: "", officeDeadline: "" }];
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
        heading={isUpdateMode ? "Update Deadlines" : "Create New Case"}
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
              label={submitting ? (isUpdateMode ? "Updating..." : "Creating...") : (isUpdateMode ? "Update Deadlines" : "Create Case")} 
              variant="outlined" 
              leftIcon={!submitting && <IoMdCheckmark color="var(--midnight-black)"/>}
              onClick={() => formik.handleSubmit()}
              disabled={submitting || loadingCaseDetails}
              loading={submitting}
              showSpinner={true}
            />
          </div>
        }
      >
        <div className={classes.iconInputContainer}>
        {loadingCaseDetails && isUpdateMode ? (
          <div style={{ padding: "20px", textAlign: "center" }}>Loading case details...</div>
        ) : (
          <>
          <IconInput icon={<FaBalanceScale size={22} />} title="Jurisdiction">
              <DropDown
                options={jurisdictionOptions}
                placeholder={loading ? "Loading..." : "Select Jurisdiction"}
                values={formik.values.jurisdiction ? jurisdictionOptions.filter(opt => opt.value === formik.values.jurisdiction) : []}
                className={classes.dropdown}
                closeOnSelect={true}
                disabled={loading || isUpdateMode}
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
            icon={<MdOutlineAssignment size={22} />}
            title="Type of Case"
          >
            <DropDown
              options={caseTypeOptions}
              placeholder={formik.values.jurisdiction ? "Select Case Type" : "Select Jurisdiction first"}
              values={formik.values.caseType ? caseTypeOptions.filter(opt => opt.value === formik.values.caseType) : []}
              className={classes.dropdown}
              closeOnSelect={true}
              disabled={!formik.values.jurisdiction || caseTypeOptions.length === 0 || isUpdateMode}
              onChange={(value) => {
                const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                formik.setFieldValue("caseType", selectedValue);
              }}
            />
            {formik.touched.caseType && formik.errors.caseType && (
              <div className={classes.errorText}>{formik.errors.caseType}</div>
            )}
            {formik.values.jurisdiction && caseTypeOptions.length === 0 && !isUpdateMode && (
              <div className={classes.errorText}>No case types available for this jurisdiction</div>
            )}
          </IconInput>
          <IconInput icon={<FaUser size={22} />} title="Client Name">
            <DropDown
              options={clientOptions}
              placeholder={loadingClients ? "Loading..." : "Select Client"}
              values={formik.values.clientName ? clientOptions.filter(opt => opt.value === formik.values.clientName) : []}
              className={classes.dropdown}
              closeOnSelect={true}
              disabled={loadingClients || isUpdateMode}
              searchable={true}
              onChange={(value) => {
                const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                formik.setFieldValue("clientName", selectedValue);
              }}
              onDropdownClose={() => {
                formik.setFieldTouched("clientName", true);
              }}
            />
            {formik.touched.clientName && formik.errors.clientName && (
              <div className={classes.errorText}>{formik.errors.clientName}</div>
            )}
          </IconInput>
          <IconInput icon={<IoMdKey size={22} />} title="Reference">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.reference}
              setValue={(value) => formik.setFieldValue("reference", value)}
              error={formik.touched.reference && formik.errors.reference}
              disabled={isUpdateMode}
            />
          </IconInput>
          <IconInput
            icon={<AiOutlineCheckCircle size={22} />}
            title="Trademark Name"
          >
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.trademarkName}
              setValue={(value) => formik.setFieldValue("trademarkName", value)}
              error={formik.touched.trademarkName && formik.errors.trademarkName}
              disabled={isUpdateMode}
            />
          </IconInput>
          <IconInput
            icon={<AiOutlineCheckCircle size={22} />}
            title="Trademark Number"
          >
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.trademarkNumber}
              setValue={(value) => formik.setFieldValue("trademarkNumber", value)}
              error={formik.touched.trademarkNumber && formik.errors.trademarkNumber}
              disabled={isUpdateMode}
            />
          </IconInput>
          
          <IconInput
            icon={<IoCalendarClearOutline size={22} />}
            title="Deadlines"
            className={classes?.iconParent}
          >
            <div className={classes?.deadlineContainer}>
              {(formik.values.deadlines && Array.isArray(formik.values.deadlines) && formik.values.deadlines.length > 0) ? (
                formik.values.deadlines.map((deadline, index) => {
                  const isExistingDeadline = isUpdateMode && index < initialDeadlineCount;
                  return (
                    <div key={`deadline-${index}-${deadline.internalDeadline || deadline.officeDeadline || index}`} className={classes.deadlineItem}>
                      <Input 
                        type="date" 
                        className={classes?.input}
                        inputClass={classes?.inputClassName}
                        value={deadline.internalDeadline || ""}
                        setValue={(value) => handleDeadlineChange(index, "internalDeadline", value)}
                        error={formik.touched.deadlines?.[index]?.internalDeadline && formik.errors.deadlines?.[index]?.internalDeadline}
                        label="Internal Deadline"
                        disabled={isExistingDeadline}
                      />
                      <Input 
                        type="date" 
                        className={classes?.input}
                        inputClass={classes?.inputClassName}
                        value={deadline.officeDeadline || ""}
                        setValue={(value) => handleDeadlineChange(index, "officeDeadline", value)}
                        error={formik.touched.deadlines?.[index]?.officeDeadline && formik.errors.deadlines?.[index]?.officeDeadline}
                        label="Office Deadline"
                        disabled={isExistingDeadline}
                      />
                      {formik.values.deadlines.length > 1 && !isExistingDeadline && (
                        <Button
                          label=""
                          variant="outlined"
                          leftIcon={<RiDeleteBinLine color="var(--red)" size={20} />}
                          onClick={() => handleRemoveDeadline(index)}
                          className={classes.removeDeadlineButton}
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "10px", color: "#999" }}>No deadlines available</div>
              )}
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
                    placeholder={loadingStaff ? "Loading..." : "Select Primary Staff"}
                    values={formik.values.primaryStaff ? staffOptions.filter(opt => opt.value === formik.values.primaryStaff) : []}
                    className={classes.dropdown}
                    closeOnSelect={true}
                    searchable={true}
                    disabled={loadingStaff || isUpdateMode}
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
                    placeholder={loadingStaff ? "Loading..." : "Select Secondary Staff (Optional)"}
                    values={formik.values.secondaryStaff ? staffOptions.filter(opt => opt.value === formik.values.secondaryStaff) : []}
                    className={classes.dropdown}
                    closeOnSelect={true}
                    searchable={true}
                    disabled={loadingStaff || isUpdateMode}
                    onChange={(value) => {
                      const selectedValue = value && value.length > 0 ? value[0]?.value : "";
                      formik.setFieldValue("secondaryStaff", selectedValue);
                    }}
                  />
                </div>
              </div>
            </IconInput>
          </div>
          </>
        )}
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default CreateNewCaseModal;

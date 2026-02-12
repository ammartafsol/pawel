"use client";
import React, { useState, useEffect } from "react";
import classes from "./AddEditClientModal..module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import IconInput from "@/components/molecules/IconInput/IconInput";
import Input from "@/components/atoms/Input/Input";
import { CountrySelect, GetCountries } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdOutlineTag } from "react-icons/md";
import { MdPublic } from "react-icons/md";
import { SiWechat } from "react-icons/si";
import { useFormik } from "formik";
import { AddNewClientSchema } from "@/formik/schema";
import { addNewClientFormValues } from "@/formik/initialValues";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";

/** @param {{ getUserData?: (...args: any[]) => void, show: boolean, setShow: (v: boolean) => void, selectedData?: object, slug?: string, updateRoute?: string }} props */
const AddEditClientModal = ({ getUserData, show, setShow, selectedData, slug, updateRoute = "admin/users/update" }) => {
  const { Post, Patch } = useAxios();
  const [loading, setLoading] = useState("");
  const [countryList, setCountryList] = useState([]);
  const isUpdateMode = Boolean(selectedData && slug);

  useEffect(() => {
    GetCountries().then((list) => setCountryList(list || []));
  }, []);

  const formik = useFormik({
    initialValues: addNewClientFormValues,
    validationSchema: AddNewClientSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    if (show && selectedData) {
      formik.setValues({
        clientName: selectedData.fullName ?? "",
        email: selectedData.email ?? "",
        clientReference: selectedData.clientReference ?? "",
        country: selectedData.country ?? "",
        weChatId: selectedData.weChatId ?? "",
      });
    }
    if (!show) {
      formik.resetForm();
    }
  }, [show, selectedData]);

  const handleSubmit = async (values) => {
    setLoading("loading");
    const obj = {
      fullName: values.clientName,
      email: values.email,
      clientReference: values.clientReference || undefined,
      country: values.country || undefined,
      weChatId: values.weChatId || undefined,
    };

    if (isUpdateMode) {
      const { response } = await Patch({
        route: `${updateRoute}/${slug}`,
        data: obj,
      });
      if (response) {
        RenderToast({ type: "success", message: "Client updated successfully" });
        if (getUserData) getUserData();
        setShow(false);
        formik.resetForm();
      }
    } else {
      const { response } = await Post({
        route: "admin/create-client",
        data: obj,
      });
      if (response) {
        RenderToast({ type: "success", message: "Client created successfully" });
        if (getUserData) getUserData(1);
        setShow(false);
        formik.resetForm();
      }
    }
    setLoading("");
  };

  return (
    <div>
      <ModalSkeleton
        drawer={true}
        heading={isUpdateMode ? "Edit Client" : "Add New Client"}
        footerData={
          <div className={classes.footerDiv}>
            <Button
              label=""
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                setShow(false);
              }}
              leftIcon={<RiDeleteBinLine color="var(--red)" size={24} />}
            />
            <Button
              label={
                loading === "loading"
                  ? "loading..."
                  : isUpdateMode
                    ? "Update Client"
                    : "Add Client"
              }
              variant="outlined"
              loading={loading === "loading"}
              leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
              onClick={() => formik.handleSubmit()}
            />
          </div>
        }
        show={show}
        setShow={setShow}
      >
        <div className={classes.iconInputContainer}>
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
          <IconInput icon={<MdEmail size={22} />} title="Email">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.email}
              setValue={(value) => formik.setFieldValue("email", value)}
              error={formik.touched.email && formik.errors.email}
            />
          </IconInput>
          <IconInput icon={<MdOutlineTag size={22} />} title="Client Reference">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.clientReference}
              setValue={(value) => formik.setFieldValue("clientReference", value)}
              error={formik.touched.clientReference && formik.errors.clientReference}
            />
          </IconInput>
          <IconInput icon={<MdPublic size={22} />} title="Country">
            <div className={classes.countrySelectWrap}>
              <CountrySelect
                containerClassName={classes.countrySelectContainer}
                inputClassName={classes.countrySelectInput}
                placeHolder="Select country"
                showFlag={true}
                defaultValue={countryList.find(
                  (c) => c.name === formik.values.country
                )}
                onChange={(country) => {
                  formik.setFieldValue("country", country?.name ?? "");
                }}
              />
              {(formik.touched.country || formik.submitCount > 0) && formik.errors.country && (
                <p className={classes.countryError}>*{formik.errors.country}</p>
              )}
            </div>
          </IconInput>
          <IconInput icon={<SiWechat size={22} />} title="WeChat ID">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.weChatId}
              setValue={(value) => formik.setFieldValue("weChatId", value)}
              error={formik.touched.weChatId && formik.errors.weChatId}
            />
          </IconInput>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddEditClientModal;


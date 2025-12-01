"use client";

import Image from "next/image";
import { useRef } from "react";
import classes from "./UploadImageBox.module.css";
import { IoMdClose } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine, RiUploadCloud2Fill } from "react-icons/ri";
import { mergeClass, imageUrl } from "@/resources/utils/helper";

const UploadImageBox = ({
  disabled = false,
  state,
  setter,
  label,
  subLabel,
  edit = true,
  onDelete,
  onClose,
  fallBackImage,
  isCloseable,
  hideDeleteIcon = false,
  imgClass,
  uploadImageBox,
  containerClass = "",
  onEdit = () => {},
}) => {
  const inputRef = useRef(null);

  return (
    <>
      <div className={classes.main}>
        {label && (
          <label className={`${classes.label} ${subLabel && "m-0"}`}>
            {label}
          </label>
        )}
        {subLabel && <label className={classes.subLabel}>{subLabel}</label>}

        <div className={`${classes.box} ${containerClass}`}>
          <div className={mergeClass(classes.uploadImageBox, uploadImageBox)}>
            {/* Close Icon */}
            {isCloseable && (
              <span className={classes.closeIcon} onClick={onClose}>
                {/* <MdClose /> */}
                <IoMdClose />
              </span>
            )}
            {state?.name || typeof state == "string" ? (
              <div className={classes.imageUploaded}>
                <img
                  src={
                    typeof state == "object"
                      ? URL.createObjectURL(state)
                      : imageUrl(state)
                  }
                  alt=""
                  className={imgClass ? imgClass : ""}
                />
                {/* Edit (pencil) Icon Overlay */}
                {/* <div
                  className={classes.editOverlayIcon}
                  onClick={() => inputRef.current.click()}
                  title="Change photo"
                >
                  <MdModeEdit />
                </div> */}
                <div className={classes.editAndDelete}>
                  {edit && (
                    <>
                      {!hideDeleteIcon && (
                        <div className={classes.icon} onClick={onDelete}>
                          <RiDeleteBinLine />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={classes.uploadBox}
                onClick={() => inputRef.current.click()}
              >
                <div className={classes?.user}>
                  <Image
                    src={"/Images/app-images/dummyProfile.png"} //by default
                    fill
                    alt="user"
                  />
                  {/* Edit (pencil) Icon Overlay */}
                  <div
                    className={classes.editOverlayIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current.click();
                    }}
                    title="Upload photo"
                  >
                    <MdModeEdit />
                  </div>
                </div>
                <div
                  className={
                    disabled ? classes.uploadIconDisabled : classes.uploadIcon
                  }
                >
                  {fallBackImage ? (
                    <div className={classes.imgDiv}>
                      <img src={fallBackImage} alt="fallBackImage" />
                    </div>
                  ) : (
                   ""
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Input For Image Upload */}
          <input
            disabled={disabled}
            hidden
            type={"file"}
            ref={inputRef}
            onChange={(e) => setter(e.target.files[0])}
          />
        </div>
      </div>
    </>
  );
};

export default UploadImageBox;

import { Modal } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";
import { useEffect, useState } from "react";
import classes from "./modalSkeleton.module.css";

export default function ModalSkeleton({
  size = "lg",
  show,
  setShow,
  heading,
  subheading,
  children,
  modalBodyClass,
  showCloseIcon,
  headerClass,
  modalMainClass,
  footerData = null,
  footerClass,
  variant = "primary",
  icon,
  drawer = false,
}) {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (show) {
      if (drawer) {
        setAnimationClass(classes.modalEnterDrawer);
      } else {
        setAnimationClass(
          variant === "primary" ? classes.modalEnter : classes.modalEnterSecondary
        );
      }
    } else if (animationClass) {
      if (drawer) {
        setAnimationClass(classes.modalExitDrawer);
      } else {
        setAnimationClass(
          variant === "primary" ? classes.modalExit : classes.modalExitSecondary
        );
      }
    }
  }, [show, drawer, variant]);

  const handleClose = () => {
    if (drawer) {
      setAnimationClass(classes.modalExitDrawer);
    } else {
      setAnimationClass(
        variant === "primary" ? classes.modalExit : classes.modalExitSecondary
      );
    }
    setTimeout(() => setShow(false), 300); // Match the CSS animation duration
  };

  return (
    <Modal
      size={size}
      show={show}
      onHide={handleClose}
      centered={!drawer}
      dialogClassName={clsx(
        drawer && classes.modalDialogDrawer,
        variant === "secondary"
          ? classes.modalDialogSecondary
          : !drawer && classes.modalDialog,
        animationClass,
        modalMainClass
      )}
      className={clsx(
        drawer && classes.modalDrawer,
        variant === "secondary" ? classes.modalSecondary : !drawer && classes.modal,
        modalMainClass
      )}
      backdropClassName="custom-backdrop"
    >
      {(heading || subheading) && (
        <div className={clsx(classes.headingBox, headerClass)}>
          {heading && (
            <h2
              className={clsx(
                "fs18 fw-600 heading-color lh24",
                classes.heading
              )}
              style={{
                display: icon ? "flex" : "block",
                alignItems: icon ? "center" : "flex-start",
                gap: icon ? "8px" : "0px",
              }}
            >
              {icon && icon}
              {heading}
            </h2>
          )}
          {showCloseIcon && (
            <div className={classes.iconBox} onClick={handleClose}>
              <AiOutlineClose size={13} color="var(--midnight-black)" className={classes.icon} />
            </div>
          )}
        </div>
      )}
      <Modal.Body className={clsx(classes.body, modalBodyClass)}>
        {children}
      </Modal.Body>
      {footerData && (
        <Modal.Footer
          className={`${classes?.footer} ${footerClass}`}
        >
          {footerData}
        </Modal.Footer>
      )}
    </Modal>
  );
}

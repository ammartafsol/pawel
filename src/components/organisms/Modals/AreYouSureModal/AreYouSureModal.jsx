"use client";
import PropTypes from "prop-types";
import Button from "@/components/atoms/Button";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import ModalSkeleton from "@/components/organisms/Modals/ModalSkeleton/ModalSkeleton";
import classes from "./styleAreYouSureModal.module.css";
import clsx from "clsx";

const AreYouSureModal = ({
  show,
  setShow,
  title = "Are You Sure?",
  subTitle = "This action cannot be undone. Please confirm to proceed.",
  onClick,
  icon,
  showCloseIcon,
  isLoading,
  type = "warning", // warning, danger, info, success
  buttonLabel = "Confirm",
}) => {
  // Icon mapping based on type
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "danger":
        return (
          <div className={classes.dangerIcon}>
            <FiAlertCircle size={32} />
          </div>
        );
      case "warning":
        return (
          <div className={classes.warningIcon}>
            <FiAlertTriangle size={32} />
          </div>
        );
      case "info":
        return (
          <div className={classes.infoIcon}>
            <FiInfo size={32} />
          </div>
        );
      case "success":
        return (
          <div className={classes.successIcon}>
            <FiCheckCircle size={32} />
          </div>
        );
      default:
        return (
          <div className={classes.defaultIcon}>
            <FiAlertTriangle size={32} />
          </div>
        );
    }
  };

  return (
    <ModalSkeleton
      variant="primary"
      size="lg"
      setShow={setShow}
      show={show}
      heading=""
      showCloseIcon={showCloseIcon}
      modalBodyClass={classes.modalBody}
      modalMainClass={classes.modal}
    >
      <div className={classes.modalContent}>
        {/* Icon Section */}
        <div className={classes.iconSection}>{getIcon()}</div>

        {/* Title Section */}
        <div className={classes.titleSection}>
          <h2 className={clsx(classes.title)}>{title}</h2>
          <p className={clsx(classes.subtitle)}>{subTitle}</p>
        </div>

        {/* Action Buttons */}
        <div className={classes.actionSection}>
          <Button
            disabled={isLoading}
            variant="outlined"
            label="Cancel"
            onClick={() => setShow(false)}
            className={classes.button}
          />
          <Button
            disabled={isLoading}
            variant="primary"
            label={isLoading ? "Please wait..." : buttonLabel}
            onClick={onClick}
            className={classes.button}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
};

AreYouSureModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node,
  showCloseIcon: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf(["warning", "danger", "info", "success"]),
  buttonLabel: PropTypes.string,
};

AreYouSureModal.defaultProps = {
  title: "Are You Sure?",
  subTitle: "This action cannot be undone. Please confirm to proceed.",
  icon: null,
  showCloseIcon: undefined,
  isLoading: false,
  type: "warning",
  buttonLabel: "Confirm",
};

export default AreYouSureModal;

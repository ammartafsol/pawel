import React from 'react'
import PropTypes from 'prop-types'
import classes from './BannerMessage.module.css'
import { PiTagSimple } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";

export default function BannerMessage({ 
  show = true,
  setShow,
  title = "Case Progress",
  message = "Your TM Cancellation has been proceeded from Defense to Second Observation",
  onViewDetails,
  onClose,
}) {
  return (
    show && ( 
    <div className={classes.banner}>
      <div className={classes.leftSection}>
        <div className={classes.titleRow}>
          <PiTagSimple className={classes.icon} />
          <h3 className={classes.title}>{title}</h3>
        </div>
        <p className={classes.message}>{message}</p>
      </div>
      <button 
        className={classes.viewDetailsBtn}
        onClick={onViewDetails}
      >
        View Details
      </button>
      <button 
        className={classes.closeBtn}
          onClick={() => setShow(false)}
          aria-label="Close"
      >
          <IoCloseOutline className={classes.closeIcon} />
        </button>
      </div>
    )
  )
}

BannerMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  onViewDetails: PropTypes.func,
  onClose: PropTypes.func
}

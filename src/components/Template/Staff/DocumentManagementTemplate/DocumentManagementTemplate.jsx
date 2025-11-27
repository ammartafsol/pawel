"use client"

import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import classes from "./DocumentManagementTemplate.module.css"

const DocumentManagementTemplate = () => {

  return (
   <div className="p24">
    <Wrapper >
      <div className={classes?.documentManagementContainer}></div>
    </Wrapper>
   </div>
  )
}

export default DocumentManagementTemplate




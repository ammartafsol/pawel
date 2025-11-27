"use client";
import React, { useState, useRef } from "react";
import classes from "./DocumentManagementTemplate.module.css";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { gridFilter } from "@/developementContent/Enums/enum";
import { documentManagementTableHeader } from "@/developementContent/TableHeader/DocumentManagementTableHeader";
import { documentManagementTableBody } from "@/developementContent/TableBody/DocumentManagementTableBody";
import { GoQuestion } from "react-icons/go";
import { Col, Row } from "react-bootstrap";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import DocCard from "@/components/atoms/DocCard/DocCard";
import { mergeClass } from "@/resources/utils/helper";

const DocumentManagementTemplate = () => {
  const [activeGridFilter, setActiveGridFilter] = useState(gridFilter[0]);
  const [searchValue, setSearchValue] = useState("");
  const fileInputRef = useRef(null);

  const handleFilterClick = () => {
    console.log("Filter clicked");
  };

  const handleUploadDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Handle file selection here
      console.log("Selected files:", selectedFiles);
      // You can add your file upload logic here
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const filterOptions = [
    {
      label: "All",
      onClick: () => {
        console.log("Filter: All");
      }
    },
    {
      label: "TM Opposition",
      onClick: () => {
        console.log("Filter: TM Opposition");
      }
    },
    {
      label: "Design invalidation",
      onClick: () => {
        console.log("Filter: Design invalidation");
      }
    },
    {
      label: "Privacy Violations",
      onClick: () => {
        console.log("Filter: Privacy Violations");
      }
    },
    {
      label: "Employment Disputes",
      onClick: () => {
        console.log("Filter: Employment Disputes");
      }
    }
  ];

  return (
    <div className="p24">
       <Wrapper
          headerComponent={
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                style={{ display: "none" }}
              />
              <TableHeader
                title="Document Management"
                titleIcon={<GoQuestion color="#D9D9D9" size={24} />}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search..."
                onFilterClick={handleFilterClick}
                filterOptions={filterOptions}
                viewButtonText="Upload Document"
                onClickViewAll={handleUploadDocument}
                gridFilter={gridFilter}
                activeGridFilter={activeGridFilter}
                setActiveGridFilter={setActiveGridFilter}
                gridFilterClassName={classes.gridFilter}
              />
            </>
          }
          contentClassName={classes.contentClassName}
        >
          {
            activeGridFilter.value === "table" ? (
              <ResponsiveTable
                tableHeader={documentManagementTableHeader}
                data={documentManagementTableBody}
              />
            ) : (
              <Row className={mergeClass("g-4", classes.docCardRow)}>
                {documentManagementTableBody?.map((item) => (
                  <Col className="col-12 col-md-4" key={item.id}>
                    <DocCard
                      title={item.documentName}
                      dateTime={item.dateUploaded}
                      clientName={item.clientName}
                      trademarkNo={item.tradeMarkNo}
                      caseType={item.typeOfCase}
                      isDetailedVariant={true}
                    />
                  </Col>
                ))}
              </Row>
            )
          }
        </Wrapper>
    </div>
  );
};

export default DocumentManagementTemplate;




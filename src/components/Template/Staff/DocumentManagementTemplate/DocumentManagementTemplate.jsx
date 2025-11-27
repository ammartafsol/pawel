"use client";
import React, { useState } from "react";
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

const DocumentManagementTemplate = () => {
  const [activeGridFilter, setActiveGridFilter] = useState(gridFilter[0]);
  const [searchValue, setSearchValue] = useState("");

  const handleFilterClick = () => {
    console.log("Filter clicked");
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
      {activeGridFilter.value === "table" ? (
        <Wrapper
          headerComponent={
            <TableHeader
              title="Document Management"
              titleIcon={<GoQuestion color="#D9D9D9" size={24} />}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              searchPlaceholder="Search..."
              onFilterClick={handleFilterClick}
              filterOptions={filterOptions}
              viewButtonText="Upload Document"
              onClickViewAll={() => {
                console.log("Upload Document clicked");
              }}
              gridFilter={gridFilter}
              activeGridFilter={activeGridFilter}
              setActiveGridFilter={setActiveGridFilter}
              gridFilterClassName={classes.gridFilter}
            />
          }
          contentClassName={classes.contentClassName}
        >
          <ResponsiveTable
            tableHeader={documentManagementTableHeader}
            data={documentManagementTableBody}
          />
        </Wrapper>
      ) : (
        <div>
          <Wrapper
            headerComponent={
              <TableHeader
                title="Document Management"
                titleIcon={<GoQuestion color="#D9D9D9" size={20} />}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                searchPlaceholder="Search..."
                onFilterClick={handleFilterClick}
                filterOptions={filterOptions}
                viewButtonText="Upload Document"
                onClickViewAll={() => {
                  console.log("Upload Document clicked");
                }}
                gridFilter={gridFilter}
                activeGridFilter={activeGridFilter}
                setActiveGridFilter={setActiveGridFilter}
                gridFilterClassName={classes.gridFilter}
              />
            }
            contentClassName={classes.contentClassName}
          >
            <Row className="g-4">
              {documentManagementTableBody.map((item) => (
                <Col className="col-12 col-md-4" key={item.id}>
                  <div className={classes.documentCard}>
                    <h5>{item.documentName}</h5>
                    <p><strong>Client:</strong> {item.clientName}</p>
                    <p><strong>Type:</strong> {item.typeOfCase}</p>
                    <p><strong>Trade Mark:</strong> {item.tradeMarkNo}</p>
                    <p><strong>Date:</strong> {item.dateUploaded}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Wrapper>
        </div>
      )}
    </div>
  );
};

export default DocumentManagementTemplate;




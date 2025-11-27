"use client";
import React, { useState } from "react";
import classes from "./DashboardTemplate.module.css";
import { Col, Row } from "react-bootstrap";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import Calender from "@/components/molecules/Calender/Calender";
import { myEventsList } from "@/developementContent/Data/dummtData/dummyData";
import CalenderHeaderDrop from "@/components/atoms/TableHeaderDrop/CalenderHeaderDrop";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import { newCasesData } from "@/developementContent/Data/data";
import ResponsiveTable from "@/components/organisms/ResponsiveTable/ResponsiveTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";
import TableHeader from "@/components/molecules/TableHeader/TableHeader";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { reactActivities } from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";

const DashboardTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(reactActivities[0]);
const router = useRouter();

  const handleDropdownChange = (value) => {
    setSelectedDropdownValue(value);
  };

  return (
    <div>
      <div className={classes?.dashboardTemplateHeader}>
        <h4>Wednesday, February 14th</h4>
        <p>Good morning, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={7} >
            <Wrapper
              contentClassName={classes?.calenderWrapper}
              headerComponent={<CalenderHeaderDrop />}
            >
              <Calender className={classes?.calender} events={myEventsList} />
            </Wrapper>
          </Col>
          <Col lg={5}>
            <div className={classes?.newCases}>
              <Row className="g-4">
                {newCasesData.map((item) => (
                  <Col md={6} key={item.id}>
                    <ActionCard
                      {...item}
                      title={item.title}
                      image={item.image}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Wrapper
              headerComponent={
                <TableHeader
                  viewButtonText="View All"
                  onClickViewAll={() => router.push("/staff/case-management")}
                  title="Recent Activities"
                  dropdownOptions={reactActivities}
                  dropdownPlaceholder="Select Activity"
                  selectedDropdownValue={selectedDropdownValue}
                  setSelectedDropdownValue={setSelectedDropdownValue}
                />
              }
              className={classes.wrapper}
              contentClassName={classes.contentClassName}
            >
              <ResponsiveTable
                tableHeader={staffDashboardTableHeader}
                data={staffDashboardTableBody}
              />
            </Wrapper>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardTemplate;

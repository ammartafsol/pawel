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
import { caseStatusFilters, reactActivities } from "@/developementContent/Enums/enum";
import { useRouter } from "next/navigation";
import CreateNewCaseModal from "@/components/organisms/Modals/CreateNewCaseModal/CreateNewCaseModal";

const DashboardTemplate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedDropdownValue, setSelectedDropdownValue] = useState(caseStatusFilters[0]);
  const [showCreateNewCaseModal, setShowCreateNewCaseModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleDropdownChange = (value) => {
    setSelectedDropdownValue(value);
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <div>
      <div className={classes?.dashboardTemplateHeader}>
        <h4>{new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</h4>
        <p>{getGreeting()}, John Doe.</p>
      </div>
      <div className="p24">
        <Row>
          <Col lg={7} >
            <Wrapper
              contentClassName={classes?.calenderWrapper}
              headerComponent={<CalenderHeaderDrop  />}
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
                      onClick={() => {
                        if (item.title === "Create New Case") {
                          setShowCreateNewCaseModal(true);
                        }
                      }}
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
                  dropdownOptions={caseStatusFilters}
                  dropdownPlaceholder="Select Activity"
                  searchValue={searchInput}
                  onSearchChange={setSearchInput}
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
      <CreateNewCaseModal show={showCreateNewCaseModal} setShow={setShowCreateNewCaseModal} />
    </div>
  );
};

export default DashboardTemplate;

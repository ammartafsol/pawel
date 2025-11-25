"use client";
import React from 'react';
import Wrapper from '@/components/atoms/Wrapper/Wrapper';
import Calender from '@/components/molecules/Calender/Calender';
import ResponsiveTable from '@/components/organisms/ResponsiveTable/ResponsiveTable';

const DashboardTemplate = () => {
  // Sample events data - events shown in time slots
  const myEventsList = [
    {
      start: new Date(2025, 10, 28, 10, 0),
      end: new Date(2025, 10, 28, 11, 0), /// should be 2025, 10, 28, 11, 0
      title: "Event 1",
    },
    {
      start: new Date(2025, 10, 28, 12, 0),
      end: new Date(2025, 10, 28, 13, 0),
      title: "Event 2",
    },
    {
      start: new Date(2025, 10, 28, 10, 0),
      end: new Date(2025, 10, 28, 11, 0), /// should be 2025, 10, 28, 11, 0
      title: "Event 1",
    },
    {
      start: new Date(2025, 10, 28, 12, 0),
      end: new Date(2025, 10, 28, 13, 0),
      title: "Event 2",
    },
  ];

  return (
    <div>
      <Wrapper title="Recent Case Statuses">
        {/* ////calender     */}
        <Calender events={myEventsList} />
        <ResponsiveTable 
        tableHeader={[{
          title: "Case ID",
          key: "caseId",
        },{
          title: "Case Status",
          key: "caseStatus",
        }]}
        data={[{
          caseId: "123456",
          caseStatus: "Open",
        },{
          caseId: "123456",
          caseStatus: "Open",
        }]}
        />
      </Wrapper>
    </div>
  );
};

export default DashboardTemplate;

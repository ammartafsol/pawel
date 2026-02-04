import { RenderDateCell, RenderTextCell } from "@/components/organisms/ResponsiveTable/CommonCells";
import Link from "next/link";
import PhasePill from "@/components/atoms/PhasePill/PhasePill";

export const staffDashboardTableHeader = [
  {
    title: "Client",
    key: "client",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return <RenderTextCell cellValue={item} />;
    },
  },

  {
    title: "Trademark Name",
    key: "trademarkName",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return <RenderTextCell cellValue={item} />;
    },
  },
  {
    title: "Trademark Number",
    key: "trademarkNumber",
    style: { width: "20%" },
    renderItem: ({ item }) => {
      return (
        <Link href="#" style={{ color: "#1F5CAE", textDecoration: "none" }}>
          {item}
        </Link>
      );
    },
  },
  {
    title: "Internal Deadline",
    key: "internalDeadline",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return <RenderDateCell cellValue={item} />;
    },
  },
  // {
  //   title: "Office Deadline",
  //   key: "officeDeadline",
  //   style: { width: "15%" },
  //   renderItem: ({ item }) => {
  //     return <RenderDateCell cellValue={item} />;
  //   },
  // },
  {
    title: "Status",
    key: "status",
    style: { width: "15%" },
    renderItem: ({ item, data }) => {
      const bgColor = data?.phaseBgColor ?? "#f5f5f5";
      const color = data?.phaseColor ?? "#000000";
      return (
        <span
          style={{
            backgroundColor: bgColor,
            color,
            padding: "4px 12px",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          {item ?? "—"}
        </span>
      );
    },
  },
  {
    title: "Next Phase",
    key: "nextPhaseName",
    style: { width: "15%" },
    renderItem: ({ item, data }) => {
      const bgColor = data?.nextPhaseBgColor ?? "#f5f5f5";
      const color = data?.nextPhaseColor ?? "#000000";
      return (
        <span
          style={{
            backgroundColor: bgColor,
            color,
            padding: "4px 12px",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          {item ?? "—"}
        </span>
      );
    },
  },
  {
    title:"",
    key:"slug",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return <Link href={`/case-management/${item}`} style={{ color: "#1F5CAE",borderBottom: "1px solid #1F5CAE" }}>
        View Details
      </Link>;
    },
  }
  // {
  //   title: "Status",
  //   key: "status",
  //   style: { width: "20%" },
  //   renderItem: ({ item, data }) => {
  //     return <Status label={item} variant={data.statusVariant} />;
  //   },
  // },
  // {
  //   title: "Next Task",
  //   key: "nextTask",
  //   style: { width: "20%" },
  //   renderItem: ({ item, data }) => {
  //     return <Status label={item} variant={data.nextTaskVariant} />;
  //   },
  // },
  // {
  //   title: "Attorney",
  //   key: "attorney",
  //   style: { width: "10%" },
  //   renderItem: ({ item }) => {
  //     return <RenderTextCell cellValue={item} />;
  //   },
  // },
  // {
  //   title: "Notes",
  //   key: "notes",
  //   style: { width: "20%" },
  //   renderItem: ({ item }) => {
  //     return (
  //       <div 
  //       style={{ 
  //         paddingRight: "8px"
  //       }}>
  //         {item}
  //       </div>
  //     );
  //   },
  // },
];


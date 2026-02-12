import { RenderTextCell, RenderNotes, RenderDateCell } from "@/components/organisms/ResponsiveTable/CommonCells";
import Link from "next/link";
import moment from "moment";
import { FiEdit } from "react-icons/fi";

/**
 * @param {{ onEditDeadline?: (slug: string) => void, hasUpdateCasePermission?: boolean, viewDetailsBasePath?: string }} options
 * @returns table header column config
 */
export const getStaffDashboardTableHeader = (options = {}) => {
  const { onEditDeadline, hasUpdateCasePermission = false, viewDetailsBasePath = "/case-management" } = options;

  return [
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
  // {
  //   title: "Internal Deadline",
  //   key: "internalDeadline",
  //   style: { width: "15%" },
  //   renderItem: ({ item, data }) => {
  //     const dateDisplay =
  //       !item || item === "Unknown Internal Deadline" || item === "Unknown Office Deadline"
  //         ? "—"
  //         : moment.utc(item).format("MMMM DD, YYYY");
  //     const slug = data?.slug;
  //     const canEdit = hasUpdateCasePermission && onEditDeadline && slug;

  //     return (
  //       <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "nowrap" }}>
  //         <span style={{ flex: "1", minWidth: 0 }}>{dateDisplay}</span>
  //         {canEdit && (
  //           <button
  //             type="button"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               onEditDeadline(slug);
  //             }}
  //             aria-label="Edit deadlines"
  //             style={{
  //               display: "inline-flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               width: 28,
  //               height: 28,
  //               padding: 0,
  //               border: "none",
  //               borderRadius: "4px",
  //               background: "var(--sky-blue, #0D93FF)",
  //               color: "#fff",
  //               cursor: "pointer",
  //               flexShrink: 0,
  //             }}
  //           >
  //             <FiEdit size={14} />
  //           </button>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    title: "Office Deadline",
    key: "officeDeadline",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return <RenderDateCell cellValue={item} />;
    },
  },
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
    title: "Notes",
    key: "notes",
    style: { width: "15%" },
    // renderItem: ({ item, data }) => <RenderNotes cellValue={data?.caseNotes} />,
    renderItem: ({ item, data }) => <RenderNotes cellValue={"l dsa dsa fdrwe fds r3e gfduil usdn fsd dsf sduf us suf uafs l dsa dsa fdrwe fds r3e gfduil usdn fsd dsf sduf us suf uafs l dsa dsa fdrwe fds r3e gfduil usdn fsd dsf sduf us suf uafs l dsa dsa fdrwe fds r3e gfduil usdn fsd dsf sduf us suf uafs "} />,
  },
  {
    title: "",
    key: "slug",
    style: { width: "15%" },
    renderItem: ({ item }) => {
      return (
        <Link href={`${viewDetailsBasePath}/${item}`}>
          View Details
        </Link>
      );
    },
  },
  ];
};

/** @deprecated Use getStaffDashboardTableHeader() for recent activities table to support edit icon */
export const staffDashboardTableHeader = getStaffDashboardTableHeader();


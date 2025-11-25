import Status from "@/components/atoms/Status/Status";

export const myCasesTableHeader = [
  {
    title: "Type of Case",
    key: "typeOfCase",
    style: { width: "15%" },
  },
  {
    title: "Trademark Name",
    key: "trademarkName",
    style: { width: "20%" },
  },
  {
    title: "Trademark Number",
    key: "trademarkNumber",
    style: { width: "15%" },
  },
  {
    title: "Status",
    key: "status",
    style: { width: "18%" },
    renderItem: ({ item, data }) => {
      // Handle status with badge (e.g., "Cooling-Of 47.5")
      if (data.statusBadge) {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Status label={item} variant={data.statusVariant} />
            {/* {data.statusBadge && (
              <span
                style={{
                  backgroundColor: "var(--error)",
                  color: "var(--white)",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {data.statusBadge}
              </span>
            )} */}
          </div>
        );
      }
      return <Status label={item} variant={data.statusVariant} />;
    },
  },
  {
    title: "Next Task",
    key: "nextTask",
    style: { width: "18%" },
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.nextTaskVariant} />;
    },
  },
  {
    title: "Notes",
    key: "notes",
    style: { width: "14%" },
  },
];


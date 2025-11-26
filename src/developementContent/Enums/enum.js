import { MdGridView } from "react-icons/md";
import { PiDeviceTabletSpeakerLight } from "react-icons/pi";


export const ticketIssues = [
  {
    value: 1,
    label: "I have issue with my account",
  },
  {
    value: 2,
    label: "I have issue with my billing",
  },
];

export const gridFilter = [
  {
    value: "table",
    label: "Table",
    icon: <PiDeviceTabletSpeakerLight />,
  },
  {
    value: "grid",
    label: "Grid",
    icon: <MdGridView />,
  },
];

export const caseDetailTabs = [
  {
    value: "notes",
    label: "Notes",
  },
  {
    value: "activityLog",
    label: "Activity Log",
  },
  {
    value: "documents",
    label: "Documents",
  },
];


export const reactActivities = [
  {
    label:"All",
    value:"all"
  },
  {
    label:"Today",
    value:"today"
  },
  {
    label:"Yesterday",
    value:"yesterday"
  },
  {
    label:"Last 7 Days",
    value:"last7days"
  },
  {
    label:"Last 30 Days",
    value:"last30days"
  },
  {
    label:"Last 60 Days",
    value:"last60days"
  },
  {
    label:"Last 90 Days",
    value:"last90days"
  },
]

export const auditTrackingOptions = [
  {
    label: "All",
    value: "all"
  },
  {
    label: "Audit Tracking",
    value: "audit-tracking"
  }
]
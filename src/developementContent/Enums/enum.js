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

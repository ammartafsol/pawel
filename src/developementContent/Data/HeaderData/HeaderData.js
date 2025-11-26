import { FiGrid } from "react-icons/fi";
import { FaRegFolderClosed } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { BsQuestionCircle } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";


export const HeaderData = [
  {
    id: 1,
    name: "Dashboard",
    href: "/user",
  },
  {
    id: 2,
    name: "My Cases",
    href: "/user/my-cases",
  },
  {
    id: 3,
    name: "Support Center",
    href: "/user/support-center",
  },
];


export const StaffHeaderData = [
  {
    id: 1,
    name: "Dashboard",
    href: "/staff",
    icon: <FiGrid size={24} />,
  },
  {
    id: 2,
    name: "Case Management",
    href: "/staff/case-management",
    icon: <FaRegFolderClosed size={24}  />,
  },
  {
    id: 3,
    name: "User Management",
    href: "/staff/user-management",
    icon: <FaRegUser size={24} />,
  },
];


export const StaffToolsData = [
  {
    id: 1,
    name: "Audit Tracking",
    href: "/staff/audit-tracking",
    icon: <FiPieChart size={24}  />,
  },
  {
    id: 2,
    name: "Document Management",
    href: "/staff/document-management",
    icon: <IoDocumentTextOutline size={24}  />,
  },
  {
    id: 3,
    name: "Support",
    href: "/staff/support",
    icon: <BsQuestionCircle size={24}  />,
  }
];
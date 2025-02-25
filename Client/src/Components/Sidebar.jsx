import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext"; // Import AuthContext
import { MdOutlineInventory } from "react-icons/md";
import { FaProductHunt } from "react-icons/fa6";
import { BiCategory, BiSolidPurchaseTagAlt } from "react-icons/bi";
import { IoPersonSharp } from "react-icons/io5";
import { AiFillDollarCircle } from "react-icons/ai";
import { GoGitPullRequest } from "react-icons/go";

const inventoryItems = [
  { path: "/", icon: <MdOutlineInventory />, label: "Dashboard" },
  { path: "/categories", icon: <BiCategory />, label: "Category Management" },
  { path: "/product-managment", icon: <FaProductHunt />, label: "Product Management" },
  { path: "/suppliers", icon: <IoPersonSharp />, label: "Supplier Management" },
  { path: "/sales-managment", icon: <AiFillDollarCircle />, label: "Sales Management" },
  { path: "/purchase-request", icon: <GoGitPullRequest />, label: "Purchase Requests" },
  { path: "/purchase-order", icon: <BiSolidPurchaseTagAlt />, label: "Purchase Order" },
  { path: "/recived-goods", icon: <FaProductHunt />, label: "Goods Received" }
];

const hrItems = [
  { path: "/employee", icon: <IoPersonSharp />, label: "Employee Managment" },
  { path: "/attendance", icon: <IoPersonSharp />, label: "Attendance Tracking" },
  { path: "/leaves", icon: <AiFillDollarCircle />, label: "Leave Management" },
  { path: "/payroll", icon: <MdOutlineInventory />, label: "Payroll Processing" }
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [hrPayrollOpen, setHrPayrollOpen] = useState(false);
  const { logout } = useContext(AuthContext); // Get logout function from context
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page
  };

  const toggleInventoryDropdown = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const toggleHrPayrollDropdown = () => {
    setHrPayrollOpen(!hrPayrollOpen);
  };

  return (
    <div className="flex h-screen bg-white">
  
      {/* Sidebar */}
      <div
        className={`fixed md:relative flex-col w-64 bg-[#47464C] text-white ${isSidebarOpen ? "block" : "hidden"} md:flex`}>
        <div className="flex flex-col flex-1 p-4 space-y-4">
          <button
            className="md:hidden text-white"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            Close
          </button>

        <h1 className="text-2xl text-[#FFFF] font-bold"> ERP  </h1>

          {/* Inventory Dropdown */}
          <div className="space-y-2">
            <button
              onClick={toggleInventoryDropdown}
              className="flex gap-2 items-center p-2 hover:bg-[#993F82] rounded w-full text-left"
            >
              <MdOutlineInventory /> <span>Inventory</span>
            </button>
            {inventoryOpen && (
              <div className="ml-4 space-y-2">
                {inventoryItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex gap-2 items-center p-2 hover:bg-[#993F82] rounded"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* HR & Payroll Dropdown */}
          <div className="space-y-2">
            <button
              onClick={toggleHrPayrollDropdown}
              className="flex gap-2 items-center p-2 hover:bg-[#993F82] rounded w-full text-left"
            >
              <IoPersonSharp /> <span>HR & Payroll</span>
            </button>
            {hrPayrollOpen && (
              <div className="ml-4 space-y-2">
                {hrItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex gap-2 items-center p-2 hover:bg-[#993F82] rounded"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center p-2 hover:bg-[#993F82] rounded w-full text-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M5 11h8v2H5v3l-5-4l5-4zm-1 7h2.708a8 8 0 1 0 0-12H4a9.985 9.985 0 0 1 8-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 0 1-8-4"
            />
          </svg>
          <span className="font-bold">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="flex justify-between items-center bg-[#FFFFFF] p-4 shadow">
          <button
            className="md:hidden text-[#47464C]"
            onClick={toggleSidebar}
            aria-label="Open Sidebar"
          >
            Open
          </button>
        </header>
      </div>
    </div>
  );
};

export default Sidebar;





// import { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../Auth/AuthContext"; // Import AuthContext
// import { MdOutlineInventory } from "react-icons/md";
// import { FaProductHunt } from "react-icons/fa6";
// import { BiCategory, BiSolidPurchaseTagAlt } from "react-icons/bi";
// import { IoPersonSharp } from "react-icons/io5";
// import { AiFillDollarCircle } from "react-icons/ai";
// import { GoGitPullRequest } from "react-icons/go";

// const menuItems = [
//   { path: "/", icon: <MdOutlineInventory />, label: "Dashboard" },
//   { path: "/categories", icon: <BiCategory />, label: "Category Management" },
//   { path: "/product-managment", icon: <FaProductHunt />, label: "Product Management" },
//   { path: "/suppliers", icon: <IoPersonSharp />, label: "Supplier Management" },
//   { path: "/sales-managment", icon: <AiFillDollarCircle />, label: "Sales Management" },
//   { path: "/purchase-request", icon: <GoGitPullRequest />, label: "Purchase Requests" },
//   { path: "/purchase-order", icon: <BiSolidPurchaseTagAlt />, label: "Purchase Order" },
//   { path: "/recived-goods", icon: <FaProductHunt />, label: "Goods Received" }

// ];

// const Sidebar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { logout } = useContext(AuthContext); // Get logout function from context
//   const navigate = useNavigate();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleLogout = () => {
//     logout(); // Call logout function from AuthContext
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       {/* Sidebar */}
//       <div
//         className={`fixed md:relative flex-col w-64 bg-[#47464C] text-white ${
//           isSidebarOpen ? "block" : "hidden"
//         } md:flex`}
//       >
//         <div className="flex flex-col flex-1 p-4 space-y-4">
//           <button
//             className="md:hidden text-white"
//             onClick={toggleSidebar}
//             aria-label="Close Sidebar"
//           >
//             Close
//           </button>
//           {menuItems.map((item, index) => (
//             <Link key={index} to={item.path} className="flex gap-2 items-center p-2 hover:bg-[#993F82] rounded">
//               {item.icon} <span>{item.label}</span>
//             </Link>
//           ))}
//         </div>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center p-2 hover:bg-[#993F82] rounded w-full text-left"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//             <path fill="currentColor" d="M5 11h8v2H5v3l-5-4l5-4zm-1 7h2.708a8 8 0 1 0 0-12H4a9.985 9.985 0 0 1 8-4c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.985 9.985 0 0 1-8-4" />
//           </svg>
//           <span className="font-bold">Logout</span>
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col flex-1">
//         <header className="flex justify-between items-center bg-[#FFFFFF] p-4 shadow">
//           <button
//             className="md:hidden text-[#47464C]"
//             onClick={toggleSidebar}
//             aria-label="Open Sidebar"
//           >
//             Open
//           </button>
//         </header>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



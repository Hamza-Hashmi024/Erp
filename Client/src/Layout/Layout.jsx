import Sidebar from "../Components/Sidebar";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#FFFFFF]">
      {/* Sidebar */}
      <div className="w-64 bg-[#47464C]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#FFFFFF] text-[#47464C]">
        {children}
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

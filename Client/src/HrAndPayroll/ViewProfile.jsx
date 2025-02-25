import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../assets/Logo.jpeg";

const ViewProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL_EMP;
  const profileRef = useRef();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${apiUrl}/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };
    fetchEmployee();
  }, [id]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const downloadPDF = () => {
    const input = profileRef.current;
    const button = input.querySelector("button");
    button.style.display = "none";

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth() - 20;
        const pageHeight = (canvas.height * pageWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, pageWidth, pageHeight);
        pdf.save(`${employee.full_name}_Profile.pdf`);
        button.style.display = "block";
      })
      .catch(() => {
        button.style.display = "block";
      });
  };

  if (!employee)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#993F82] text-lg font-semibold">
          Loading employee details...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10 flex justify-center items-start relative">
      {/* Background Logo */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
        <img src={Logo} alt="Company Logo" className="w-1/2 md:w-1/3 lg:w-1/4" />
      </div>

      <div
        ref={profileRef}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Top-left Company Logo */}
        <img
          src={Logo}
          alt="Company Logo"
          className="absolute top-6 left-6 h-14 z-10 rounded-lg shadow-sm"
        />

        {/* Content Container */}
        <div className="relative z-10 pt-24 pb-10 px-12">
          {/* Employee Name Header */}
          <h1 className="text-4xl font-bold text-[#993F82] text-center mb-6 uppercase tracking-wide">
            {employee.full_name}
          </h1>

          {/* Details Table */}
          <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <tbody>
                {/* Loop through employee details */}
                {Object.entries(employee).map(([key, value], index) => {
  // Format Dependants Properly
  if (key === "dependants" && Array.isArray(value)) {
    return (
      <tr key={key} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-gray-200`}>
        <td className="px-6 py-4 font-semibold text-gray-700 capitalize w-1/3">
          Dependants
        </td>
        <td className="px-6 py-4 text-gray-800 w-2/3">
          {value.length > 0 ? (
            <div className="space-y-3">
              {value.map((dep, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#993F82] text-white rounded-full text-sm font-semibold">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{dep.name}</p>
                    <p className="text-gray-700 text-sm">
                      {dep.relationship} - {dep.age} years old
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">None</span>
          )}
        </td>
      </tr>
    );
  }

  // Format Date Fields
  if (key === "date_of_birth" || key === "joining_date") {
    return (
      <tr key={key} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-gray-200`}>
        <td className="px-6 py-4 font-semibold text-gray-700 capitalize w-1/3">
          {key.replace(/_/g, " ")}
        </td>
        <td className="px-6 py-4 text-gray-800 w-2/3">
          {formatDate(value)}
        </td>
      </tr>
    );
  }

  return (
    <tr key={key} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-gray-200`}>
      <td className="px-6 py-4 font-semibold text-gray-700 capitalize w-1/3">
        {key.replace(/_/g, " ")}
      </td>
      <td className="px-6 py-4 text-gray-800 w-2/3">
        {value || "N/A"}
      </td>
    </tr>
  );
})}

                
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={downloadPDF}
              className="bg-[#993F82] hover:bg-[#7a2c67] text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;


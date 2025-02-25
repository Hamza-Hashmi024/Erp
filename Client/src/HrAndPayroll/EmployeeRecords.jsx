import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EmployeeRecords = () => {
  const { id } = useParams();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL_EMP;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get/records/${id}`);
        setPromotions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPromotions();
    } else {
      setLoading(false);
      setError("No employee ID provided");
    }
  }, [id, apiUrl]);

  if (loading) return <div className="text-[#47464C]">Loading promotion history...</div>;
  if (error) return <div className="text-red-600">Error loading promotions: {error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-[#993F82]">Promotion History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#993F82] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Old Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">New Designation</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Old Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">New Salary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-[#47464C]">
            {promotions.map((promotion) => (
              <tr key={promotion.history_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(promotion.promotion_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{promotion.old_designation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#993F82] font-semibold">
                  {promotion.new_designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${parseFloat(promotion.old_salary).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#993F82] font-semibold">
                  ${parseFloat(promotion.new_salary).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promotions.length === 0 && (
          <div className="text-center py-4 text-gray-500">No promotion history found</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeRecords;

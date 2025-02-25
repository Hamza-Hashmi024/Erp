import { useState, useEffect } from 'react';
import axiosInstance from '../AxiosInstance';

const GoodsReceivedComponent = () => {
  const [grns, setGRNs] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    receivedBy: '',
    condition: '',
    orderId: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchGRNs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${apiUrl}/grns`, {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate,
          receivedBy: filters.receivedBy,
          condition: filters.condition,
          orderId: filters.orderId,
          sortBy: sortConfig.key,
          sortOrder: sortConfig.direction
        }
      });
      setGRNs(response.data.grns || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch GRN data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGRNs();
  }, [filters, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      receivedBy: '',
      condition: '',
      orderId: ''
    });
    setSortConfig({ key: null, direction: 'asc' });
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#FFFFFF", color: "#47464C" }}>
    <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#993F82" }}>Goods Recived </h1>
          <div className="h-1 w-20" style={{ backgroundColor: "#993F82" }}></div>
        </header>
      
      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Received By</label>
            <input
              type="text"
              name="receivedBy"
              value={filters.receivedBy}
              onChange={handleFilterChange}
              placeholder="Search receiver"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="Good">Good</option>
              <option value="Damaged">Damaged</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order ID</label>
            <input
              type="text"
              name="orderId"
              value={filters.orderId}
              onChange={handleFilterChange}
              placeholder="Enter Order ID"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-4 flex gap-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded border"
            style={{ backgroundColor: "#F3F4F6", color: "#47464C" }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 text-center py-4">{error}</div>}

      {/* GRN Table */}
      {grns.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead style={{ backgroundColor: "#993F82", color: "#FFFFFF" }}>
              <tr>
                {['GRN ID', 'Order ID', 'Received Date', 'Received By', 'Condition', 'Notes'].map((header) => (
                  <th
                    key={header}
                    className="p-2 cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase().replace(' ', '_'))}
                  >
                    {header}
                    {sortConfig.key === header.toLowerCase().replace(' ', '_') && (
                      <span className="ml-2">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grns.map(grn => (
                <tr key={grn.id} className="hover:bg-gray-50">
                  <td className="p-2">{grn.id}</td>
                  <td className="p-2">{grn.order_id}</td>
                  <td className="p-2">{new Date(grn.received_date).toLocaleDateString()}</td>
                  <td className="p-2">{grn.received_by}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded ${
                      grn.condition === 'Good' ? 'bg-green-100 text-green-800' :
                      grn.condition === 'Damaged' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {grn.condition}
                    </span>
                  </td>
                  <td className="p-2 max-w-xs truncate">{grn.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <div className="text-center py-4">No GRNs found matching your criteria</div>
      )}
    </div>
  );
};

export default GoodsReceivedComponent;


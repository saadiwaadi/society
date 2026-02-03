import { useState, useEffect } from "react";
import api from "../services/api.js";

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState("complaints");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch data whenever the tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Dynamic endpoint based on tab (e.g., /complaints, /bookings)
      // We assume the backend filters data by the logged-in user's Token
      const endpoint = `/${activeTab}`; 
      const res = await api.get(endpoint);
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
      // setData([]); // Fail gracefully
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-gray-500">Unit: {user?.unit_no || "N/A"}</p>
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          {["complaints", "bookings", "challans"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 capitalize font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow p-6 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold capitalize">{activeTab} History</h2>
            {activeTab !== "challans" && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                + New {activeTab.slice(0, -1)}
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading data...</p>
          ) : data.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>No {activeTab} found.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {data.map((item) => (
                <li key={item._id} className="border p-4 rounded hover:bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.subject || item.facility || "Invoice"}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === 'Resolved' || item.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status || "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description || `Amount: $${item.amount}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default MemberDashboard;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminPanel() {
  const [issueData, setIssueData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    condition: '',
    status: '',
    equipmentType: ''
  });
  const recordsPerPage = 10;

  useEffect(() => {
    fetchIssueData();
  }, []);

  const fetchIssueData = () => {
    const token = localStorage.getItem('admin_token');
    
    axios.get('https://invenso-backend.onrender.com/assetManagement/issue', {
      headers: {
        'x-admin-token': token,
      },
    })
    .then(response3 => {
      setIssueData(response3.data); 
      console.log(response3.data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const updateStatus = async (issueId, newStatus) => {
    const token = localStorage.getItem('admin_token');
    
    try {
      console.log('Updating issue:', issueId);
      await axios.put(`https://invenso-backend.onrender.com/assetManagement/issue/${issueId}`, 
        { Status: newStatus },
        {
          headers: {
            'x-admin-token': token,
          },
        }
        
      );
      
      fetchIssueData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getReversedData = () => {
    return Array.isArray(issueData) ? [...issueData].reverse() : [];
  };

  const getFilteredData = () => {
    let filteredData = getReversedData();
    
    if (filters.location) {
      filteredData = filteredData.filter(item => 
        item.Location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.condition) {
      filteredData = filteredData.filter(item => 
        item.condition?.toLowerCase().includes(filters.condition.toLowerCase())
      );
    }
    
    if (filters.status) {
      filteredData = filteredData.filter(item => 
        item.Status?.toLowerCase().includes(filters.status.toLowerCase())
      );
    }
    
    if (filters.equipmentType) {
      filteredData = filteredData.filter(item => 
        item.equipmentType?.toLowerCase().includes(filters.equipmentType.toLowerCase())
      );
    }
    
    return filteredData;
  };

  const filteredData = getFilteredData();
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); 
  };

  const getUniqueValues = (key) => {
    const values = new Set();
    getReversedData().forEach(item => {
      if (item[key]) values.add(item[key]);
    });
    return Array.from(values).sort();
  };

  return (
    <div className='p-6'>
      <h1 className='text-3xl text-center mt-16 font-[1000]'>
        Welcome to Admin Dashboard
      </h1>
      <h2 className='text-2xl text-center mt-4'>
        View all reports here and Create and Manage Inventory
      </h2>

      <div className='flex text-2xl mt-12 justify-center'>
        <Link to='/inventory'>
          <button className='text-lg cursor-pointer bg-blue-500 text-white px-4 py-2 rounded'>
            Create and Manage your Inventory
          </button>
        </Link>
      </div>



      <h2 className='text-2xl text-center mt-16'>
        Check your Inventory
      </h2>
      <div className='flex flex-row justify-center mt-8'>
      <Link to='/rooms'>
        <button className='text-lg cursor-pointer bg-blue-500 text-white px-4 py-2 rounded mx-4'>
          Check Room Inventory
        </button>
      </Link>
      <br />
      <br />
      <Link to='/equipments'>
        <button className='text-lg cursor-pointer bg-blue-500 text-white px-4 py-2 rounded mx-4'>
          Check Equipment Inventory
        </button>
      </Link>
      <br />
      <br />
      <Link to='/equipmenttypes'>
        <button className='text-lg cursor-pointer bg-blue-500 text-white px-4 py-2 rounded mx-4'>
          Check Equipment Type Inventory
        </button>
      </Link>
      <br />
      <br />
      </div>
     

      <div className='mt-12'>
        <h1 className='text-3xl text-center mb-4 font-[1000]'>
          View all reports below:
        </h1>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">All Locations</option>
              {getUniqueValues('Location').map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">All Conditions</option>
              {getUniqueValues('condition').map((condition, index) => (
                <option key={index} value={condition}>{condition}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">All Status</option>
              {getUniqueValues('Status').map((status, index) => (
                <option key={index} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
            <select
              name="equipmentType"
              value={filters.equipmentType}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="">All Equipment Types</option>
              {getUniqueValues('equipmentType').map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <br />
        <table className='min-w-full border border-gray-300 text-sm'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='px-4 py-2 border'>Issue ID.</th>
              <th className='px-4 py-2 border'>Username</th>
              <th className='px-4 py-2 border'>EnrollmentNo.</th>
              <th className='px-4 py-2 border'>Equipment Type</th>
              <th className='px-4 py-2 border'>Issue History</th>
              <th className='px-4 py-2 border'>Condition</th>
              <th className='px-4 py-2 border'>Location</th>
              <th className='px-4 py-2 border'>Status</th>
              <th className='px-4 py-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((item, index) => (
                <tr key={index} className='text-center'>                               
                  <td className='px-4 py-2 border'>{item.issueId}</td>
                  <td className='px-4 py-2 border'>{item.username}</td>
                  <td className='px-4 py-2 border'>{item.enrollmentNo}</td>
                  <td className='px-4 py-2 border'>{item.equipmentType}</td>
                  <td className='px-4 py-2 border'>{item.issueHistory}</td>
                  <td className='px-4 py-2 border'>{item.condition}</td>
                  <td className='px-4 py-2 border'>{item.Location}</td>
                  <td className='px-4 py-2 border'>{item.Status}</td>
                  <td className='px-4 py-2 border'>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => updateStatus(item.issueId, 'INPROGRESS')}
                        disabled={item.Status !== 'PENDING'}
                        className={`px-2 py-1 rounded text-white ${item.Status !== 'PENDING' ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(item.issueId, 'COMPLETE')}
                        disabled={item.Status === 'COMPLETE'}
                        className={`px-2 py-1 rounded text-white ${item.Status === 'COMPLETE' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        Complete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='px-4 py-2 border text-center' colSpan="9">
                  {getReversedData().length === 0 ? 'No data available' : 'No records match your filters'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {filteredData.length > recordsPerPage && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages).keys()].map(number => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {number + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="mx-1 px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
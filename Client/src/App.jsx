import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Categories from './Pages/Categories';
import Layout from './Layout/Layout';
import ProductManagment from './Pages/productManagment';
import Dashboard from './Pages/Dashboard';
import Suppliers from './Pages/Suppliers';
import SalesManagement from './Pages/SalesManagment';
import PurchaseRequests from './Pages/PurchaseRequest';
import PurchaseOrder from './Pages/PurchaseOrder';
import NotFound from './Pages/NotFound';
import SalesReport from './Pages/SalesReport';
import GoodsReceivedComponent from './Pages/GoodsReceivedComponent';
import Login from './Auth/Login.JSX';
import { AuthProvider } from './Auth/AuthContext';
import ProtectedRoute from './Auth/ProtectedRoute';
import Employee from './HrAndPayroll/Employee';
import ViewProfile from './HrAndPayroll/ViewProfile';
import EmployeeRecords from './HrAndPayroll/EmployeeRecords';
import Attendance from './HrAndPayroll/Attendance';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                     <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
                    <Route path="/product-managment" element={<ProtectedRoute><Layout><ProductManagment /></Layout></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute><Layout><Suppliers /></Layout></ProtectedRoute>} />
                    <Route path="/sales-managment" element={<ProtectedRoute><Layout><SalesManagement /></Layout></ProtectedRoute>} />
                    <Route path="/sales-report" element={<ProtectedRoute><Layout><SalesReport /></Layout></ProtectedRoute>} />
                    <Route path="/purchase-request" element={<ProtectedRoute><Layout><PurchaseRequests /></Layout></ProtectedRoute>} />
                    <Route path="/purchase-order" element={<ProtectedRoute><Layout><PurchaseOrder /></Layout></ProtectedRoute>} />
                    <Route path="/recived-goods" element={<ProtectedRoute><Layout><GoodsReceivedComponent /></Layout></ProtectedRoute>} />
                    <Route path="/employee" element={<Layout><Employee/></Layout>}/>
                    <Route path="/employees/:id" element={<ViewProfile />} />
                    <Route path="/records/:id" element={<Layout><EmployeeRecords/></Layout> } />
                    <Route path="/attendance" element={<Layout><Attendance/></Layout> } />
                    <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;



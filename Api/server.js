require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const connect = require('./config/db');
const PORT = process.env.PORT ;
const app = express();
const AuthRoutes = require('./routes/AuthRoute.js')
const userRoutes = require('./routes/UserRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const ProductRoutes = require('./routes/productRoutes.js');
const supplierRoutes = require('./routes/suppliersRoute.js');
const salesRoutes = require('./routes/salesRoute.js');
const PurchaseRoute = require('./routes/PurchaseRoute.js');
const EmployeeRoutes = require('./routes/employeeRoute')
const AttendanceRoutes = require('./routes/Attendance')

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use('/api/auth', AuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', ProductRoutes); 
app.use('/api', supplierRoutes); 
app.use('/api', salesRoutes); 
app.use('/api', PurchaseRoute);
app.use('/api/employee' , EmployeeRoutes );

app.use('/api/attendance' , AttendanceRoutes )

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start server
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
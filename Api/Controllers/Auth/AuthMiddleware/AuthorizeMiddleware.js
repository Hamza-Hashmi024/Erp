const db = require('../../../config/db')

const authorize = (requiredPermissions) => {
  
    return async (req, res, next) => {
        try {
          console.log("🔍 Checking User Authorization...");
          console.log("🔍 User Role:", req.user.roleId);
          console.log("🔍 Required Permissions:", requiredPermissions);
          console.log("🔍 User Permissions:", req.user.permissions); 
            const userRole = req.user.role_id
             const query = `SELECT p.permission_name FROM roles r
             JOIN role_permissions rp ON r.id = rp.role_id
             JOIN permissions p ON rp.permission_id = p.id WHERE r.id = ?`
             db.query(query , [userRole] , (err, results) => {
                if(err){
                  console.log(err)
                 return res.status(500).json({message : "Error fetching user permissions"})
                }
                const userPermissions = results.map(result => result.permission_name);
                 // Check if user has the required permissions
                 const hasPermissions = requiredPermissions.every(permission => userPermissions.includes(permission));

                 if (!hasPermissions) {
                   return res.status(403).json({ message: 'Forbidden' });
                   console.log("🔍 Checking User Authorization...");
                   console.log("🔍 User Role:", req.user.roleId);
                   console.log("🔍 Required Permissions:", requiredPermissions);
                   console.log("🔍 User Permissions:", req.user.permissions); 
                  }
                 next(); // User is authorized, proceed to next middleware or route handler
            })
          } catch (err) {
            console.log(err);
          return  res.status(500).json({ message: 'Internal Server Error' });
        }
     };

     
};
module.exports = authorize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');


exports.loginUser = async (req, res) => {
const { email, password } = req.body;
 if(!email || !password){
  return res.status(400).json({message : "Email or password cannot be empty"})
 }
try {
         // Find the user by email
         const query = 'SELECT * FROM users WHERE email = ?';
         db.query(query, [email], async (err, results) => {
                 if (err) {
                     console.error(err);
                     return res.status(500).json({ message: 'Database error' });
                 }

                if (results.length === 0) {
                     return res.status(404).json({ message: 'User not found' });
               }

                 const user = results[0];
              const passwordMatch = await bcrypt.compare(password, user.password_hash);
                 if (!passwordMatch) {
                     return res.status(401).json({ message: 'Invalid credentials' });
                 }
                    // generate jwt token 
                 const token = jwt.sign({ uuid: user.uuid, roleId: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                 // Respond with the token and user data
                 res.status(200).json({ message: 'Login successful', token, user: {uuid :user.uuid , name : user.name, email: user.email, roleId: user.role_id  } });
             });
     } catch (error) {
         console.error("Login Error: ", error);
         res.status(500).json({ message: "Server Error" });
     }
 };

 exports.registerUser = async (req, res) => {
     const { name, email, password, roleId } = req.body;

     if (!name || !email || !password || !roleId) {
         return res.status(400).json({ message: 'All fields are required.' });
     }

     try {
         // Check if the email is already taken
         const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
         db.query(emailCheckQuery, [email], (err, results) => {
             if (err) {
                 console.error(err);
                 return res.status(500).json({ message: 'Database error' });
             }
             if (results.length > 0) {
                 return res.status(409).json({ message: 'Email already registered' });
             }

                 // Hash the password
             bcrypt.hash(password, 10, (err, passwordHash) => {
                 if (err) {
                     console.error(err);
                     return res.status(500).json({ message: 'Error hashing the password' });
                 }

                 // Generate a UUID for the user
                 const userUuid = uuidv4();

                 // Insert the new user into the database
                 const insertQuery = 'INSERT INTO users (uuid, name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)';
                 db.query(insertQuery, [userUuid, name, email, passwordHash, roleId], (err, result) => {
                         if (err) {
                             console.error("User creation error:", err);
                             return res.status(500).json({ message: 'Error creating user', error: err.message });
                         }
                             res.status(201).json({ message: 'User created successfully!' });
                     });
             });
         });
     } catch (error) {
         console.error("User creation error:", error);
         res.status(500).json({ message: 'Internal server error' });
     }
 };


 exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the email is already taken
        const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(emailCheckQuery, [email], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(409).json({ message: 'Email already registered' });
            }

            // Get the Admin role ID
            const getAdminRoleQuery = 'SELECT id FROM roles WHERE role_name = ?';
            db.query(getAdminRoleQuery, ['Admin'], async (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error getting Admin role', error: err.message });
                }
                if (results.length === 0) {
                    return res.status(404).json({ message: 'Admin role not found' });
                }
                const adminRoleId = results[0].id;

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Generate a UUID for the user
                const userUuid = uuidv4();

                // Insert the new user into the database
                const insertUserQuery = 'INSERT INTO users (uuid, name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)';
                db.query(insertUserQuery, [userUuid, name, email, hashedPassword, adminRoleId], (err, result) => {
                    if (err) {
                        console.error("Admin user creation error:", err);
                        return res.status(500).json({ message: 'Error creating admin user', error: err.message });
                    }
                    res.status(201).json({ message: 'Admin user created successfully!' });
                });
            });
        });
    } catch (error) {
        console.error("Admin user creation error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
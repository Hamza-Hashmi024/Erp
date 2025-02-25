const db = require('../../config/db'); 
const bcrypt = require('bcrypt'); 


// get All controllers 
exports.getAllusers = (req , res) => {
    const querry = 'Select * from users';
    db.query(querry, (err , results) =>{
        if(err){
            console.log(err)
            return res.status(500).json({message : 'error fetching users' , Error : err.message})
        }    })
}

// get users by id
exports.getUsersById = (req ,  res ) => {
    const {id} =req.params;
    const querry = 'select * from users where id = ?';
    db.querry(querry , [id] , (err , results) =>{
        if(err){
            console.log(err)
            return res.status(500).json({message : 'error fetching users By id' ,  Error : err.message})
         
        }
    }     )
}

// create a new user 
exports.createUser = (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // hash password

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error creating user', Error: err.message });
        }
        res.status(201).json({ message: 'User created successfully!' });
    });
};


// update user 
exports.updateUser = (req , res )=>{
    const {id } = req.params ;
    const {name , email , password } = req.body;
    const querry = 'update users set name = ? , email = ? , password = ? where id = ?';
    db.querry(querry , [name , email , password , id ] , (err , results ) =>{
        if(err){
            console.log(err)
            return res.status(500).json({message : 'error updating user' , Error : err.message})
        }
    })
}

// delete users 
exports.deleteUser = (req , res) =>{
    const {id} =  req.params;
    const querry = 'delete from users where id = ?';
    db.querry(querry , [id] , (err ,  results) =>{
        if(err){
            console.log(err)
            returnres.status(500).json({message : 'error deleting user' , Error : err.message  })
        }
    })
}
// get user by filter 
exports.getUsersByFilter = (req , res) =>{
    const {id , name } = req.params ;
    let querry = 'select * from users';
    const querryParams =[];
    if(id){
        querry += 'where id = ?';
        querryParams.push(id);
    }
}
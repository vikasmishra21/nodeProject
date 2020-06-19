const { create, getUsers, getUsersByUserId, updateUser, deleteUser, getUserByUserEmail } = require('./user.service')
const { genSaltSync, hashSync, compareSync } = require('bcrypt')
const { sign } = require('jsonwebtoken')

module.exports = {
    createUser: (req, res) => {
        const body = req.body
        const salt = genSaltSync(10)
        body.password = hashSync(body.password, salt)
        create(body, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                })
            }
            return res.status(200).json({
                success: 1,
                data: results
            })
        })  
    },
    getUsersByUserId: (req, res) => {
        const id = req.params.id
        getUsersByUserId(id, (err, results) => {
            if (err) {
                console.log(err)
                return
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                })
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log(err)
                return
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },
    updateUser: (req, res) => {
            const body = req.body
            const salt = genSaltSync(10)
            body.password = hashSync(body.password, salt)
            updateUser(body, (err, results) => {
                if (err) {
                    console.log(err)
                    return 
                }
                if (!results) {
                    return res.json({
                        success: 0,
                        message: "Failed to update user."
                    })
                }
                return res.json({
                    success: 1,
                    message: "Updated successfully."
                })
            })  
    },
    deleteUser: (req, res) => {
        const data = req.body
        deleteUser(data, (err, results) => {
            if (err) {
                console.log(err)
                return 
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record Not Found"
                })
            }
            return res.json({
                success: 1,
                message: "User deleted successfully."
            })
        })  
    },
    login: (req, res) => {
        const body = req.body
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err)
            }
            if(!results) {
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                })
            }
            const result = compareSync(body.password, results.password)
            if (result) {
                results.password = undefined
                const jsonToken = sign({result: results}, process.env.SECRET_KEY , {
                    expiresIn: '1h'
                })
                return res.json({
                    success: 1,
                    message: "Logged in successfully.",
                    token: jsonToken
                })
            } else {
                return res.json({
                    success: 0,
                    message: "Invalid Email or Password."
                })
            }
        })
    }
}
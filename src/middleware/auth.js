const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const validator = require('../validators/validator')
const ObjectId = mongoose.Types.ObjectId



const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });


        jwt.verify(token, "Group-69-Project-3", function (err, decodedToken) {
            if (err) {
                let message =
                    err.message === "jwt expired" ? "Token is expired" : "Token is ivalid";
                return res.status(401).send({ status: false, msg: message })
            }

            req.decodedToken = decodedToken //setting an attribute in req so that we can access it everywhere

            //console.log(decodedToken)
            next()
        });


    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const authorisation = async function (req, res, next) {
    try {
        //check authorization when data is coming from request body
        let userLoggedIn = req.decodedToken.userId

        if (req.body.userId) {
            let userId = req.body.userId

            if (!validator.isValid(userId)) return res.status(400).send({ status: false, msg: "User Id is required and should be a valid string" })

            if (!ObjectId.isValid(userId.trim())) return res.status(400).send({ status: false, msg: "userId is not valid,should be of 24 digits" })

            const userToCreateBook = await userModel.findById(userId)
            if (!userToCreateBook) return res.status(404).send({ status: false, msg: "No such user present" })

            if (userId !== userLoggedIn) return res.status(403).send({ status: false, msg: 'User not authorized to perform this action' })
            next()
        }
        if (req.params.bookId) {  //check authorization when id is coming from path params

            let bId = req.params.bookId;

            if (!ObjectId.isValid(bId)) return res.status(400).send({ status: false, msg: "Please enter valid Book Id,it should be of 24 digits" })

            let checkBook = await bookModel.findById(bId)
            if (!checkBook) return res.status(404).send({ status: false, msg: "No book present with this book Id " })


            let userToBeModified = checkBook.userId.toString();

            //console.log(userToBeModified)

            if (userToBeModified !== userLoggedIn) return res.status(403).send({ status: false, msg: 'User not authorized to perform this action' })

            if (checkBook.isDeleted == true) return res.status(400).send({ status: false, msg: "Book with the given id is already deleted!!" })

            next()

        }

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = { authenticate, authorisation };

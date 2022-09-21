const userModel = require('../models/userModel')
const validator = require('../validators/validator')
const validation = require("validator");
const jwt = require('jsonwebtoken');

const createUser = async function (req, res) {

    try {
        let data = req.body;
        let { title, name, phone, email, password, address } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Request body cannot be empty,please provide user details to create user" })

        if (!validator.isValidEnum(title)) return res.status(400).send({ status: false, msg: "Please enter a valid title,available titles are ['Mr','Mrs','Miss.]" })

        if (!validator.isValid(name)) return res.status(400).send({ status: false, msg: "Please enter a valid name" })

        if (!validator.isValid(email)) return res.status(400).send({ status: false, msg: "Please enter a valid email" })

        if (!validation.isEmail(email)) return res.status(400).send({ status: false, msg: "format of email is not valid" })

        if (!validator.isValid(phone)) return res.status(400).send({ status: false, msg: "Please enter a valid phone number" })

        const mobile = /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)
        if (mobile == false) return res.status(400).send({ status: false, msg: "Mobile number should be a valid Indian mobile number" })

        if (!validator.isValid(password)) return res.status(400).send({ status: false, msg: "Please enter a valid password" })

        const password1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,15})/.test(password)
        if (password1 == false) return res.status(400).send({ status: false, msg: "Password should contain min:8 and max:15 characters " })

        if (address) {

            if (typeof address !== 'object') return res.status(400).send({ status: false, msg: "Type of address must be object" })

            if (Object.keys(address).length === 0) return res.status(400).send({ status: false, msg: "Address body cannot be empty,please provide address details" })

            if (!validator.isValid(address.street)) return res.status(400).send({ status: false, msg: "Please enter a valid address street" })

            if (!validator.isValid(address.city)) return res.status(400).send({ status: false, msg: "Please enter a valid city for address" })

            if (!validator.isValid(address.pincode)) return res.status(400).send({ status: false, msg: "Please enter a valid pincode for address" })
        }

        let dupPhone = await userModel.findOne({ phone: phone })
        if (dupPhone) return res.status(409).send({ status: false, msg: `This mobile number is ${phone} already in use ` })

        let dupEmail = await userModel.findOne({ email: email })
        if (dupEmail) return res.status(409).send({ status: false, msg: `This email id is ${email} already in use ` })

        let createdUser = await userModel.create(data)
        return res.status(201).send({ status: true, msg: "Success", data: createdUser })
        //console.log(createdUser)
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}//function ends here

const loginUser = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "User credentials body empty!!" })

        if (!validator.isValid(email)) return res.status(400).send({ status: false, msg: "email is required!!" })
        if (!validator.isValid(password)) return res.status(400).send({ status: false, msg: "password is required!!" })

        let findUser = await userModel.findOne({ email, password })
        if (!findUser) return res.status(404).send({ status: false, msg: "Invalid login credentials" })

        let id = findUser._id;

        let payload = {
            userId: id,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        }

        const token = jwt.sign(payload, ' Ajit - project - 3')
        return res.status(200).send({ status: true, msg: "User logged in succesfully", data: token, iat: payload.iat, exp: payload.exp })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
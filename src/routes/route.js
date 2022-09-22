const express=require('express')
const router=express.Router();
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const mid=require('../middleware/auth')

router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)

router.post('/books',mid.authenticate,mid.authorisation,bookController.createBook)
router.get('/books',mid.authenticate,bookController.getBooks)
router.get('/books/:bookId',mid.authenticate,bookController.getBookById)
router.put('/books/:bookId',mid.authenticate,mid.authorisation,bookController.updateBook)
router.delete('/books/:bookId',mid.authenticate,mid.authorisation,bookController.deleteBook)

module.exports=router
const express=require('express')
const router=express.Router();
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const mid=require('../middleware/auth')
const reviewController=require('../controller/reviewController')

router.post('/register',userController.createUser)
router.post('/login',userController.loginUser)

router.post('/books',mid.authenticate,mid.authorisation,bookController.createBook)
router.get('/books',mid.authenticate,bookController.getBooks)
router.get('/books/:bookId',mid.authenticate,bookController.getBookById)
router.put('/books/:bookId',mid.authenticate,mid.authorisation,bookController.updateBook)
router.delete('/books/:bookId',mid.authenticate,mid.authorisation,bookController.deleteBook)

router.post('/books/:bookId/review',reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReview)

module.exports=router
const mongoose = require('mongoose');
const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel');
const ObjectId = mongoose.Types.ObjectId;
const validator = require('../validators/validator')

const createReview = async function (req, res) {
    let bId = req.params.bookId;
    let data = req.body;
    let { review, rating, reviewedBy } = data;

    if (!ObjectId.isValid(bId.trim())) return res.status(400).send({ status: false, msg: "Invalid Book id in path params,book id shouls be of 24 digits" })

    let checkBook = await bookModel.findById(bId)
    if (!checkBook) return res.status(404).send({ status: false, msg: "No book found for this book id!!" })

    if (checkBook.isDeleted == true) return res.status(400).send({ status: false, msg: "Cann't create review for this book as it is already deleted!" })

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Invalid parameters! Please provide data in request body to create review" })

    if (review) {
        if (!validator.isValid(review)) return res.status(400).send({ status: false, msg: "Review is required and should be a valid string" })
    }
    if (!validator.isValidRating(rating)) return res.status(400).send({ status: false, msg: "Rating is mandatory and should be a valid integer value" })

    const rat = /^[1-5]$/.test(rating)
    if (rat == false) return res.status(400).send({ status: false, msg: "Rating should be in between 1 to 5" })

    if (reviewedBy) {
        if (!validator.isValid(reviewedBy)) return res.status(400).send({ status: false, msg: "Reviewd by value should be present and a valid string" })
    }
    data['bookId'] = checkBook._id;
    data['reviewedAt'] = new Date();

    const saveReview = await reviewModel.create(data)

    let updateBook = await bookModel.findOneAndUpdate({ _id: bId }, { $inc: { reviews: 1 } }, { new: true })

    const response = await reviewModel.findById({ _id: saveReview._id }).select({ __v: 0, isDeleted: 0 })
    const final = updateBook.toObject();
    final['reviewsData'] = response;

    return res.status(201).send({ status: true, msg: "Reviews created successfully for the given book", data: final })

}

const updateReview = async function (req, res) {
    let bId = req.params.bookId;
    let rId = req.params.reviewId;
    let data = req.body;
    let { review, rating, reviewedBy } = data;
    let obj = {}

    if (!ObjectId.isValid(bId.trim())) return res.status(400).send({ status: false, msg: "Invalid Book id in path params,book id shouls be of 24 digits" })

    let checkBook = await bookModel.findById(bId)
    if (!checkBook) return res.status(404).send({ status: false, msg: "No book found for this book id!!" })

    if (checkBook.isDeleted == true) return res.status(400).send({ status: false, msg: "Cann't update review for this book as it is already deleted!" })

    if (!ObjectId.isValid(rId.trim())) return res.status(400).send({ status: false, msg: "Invalid review id in path params,review id should be of 24 digits" })

    let checkReview = await reviewModel.findById(rId)
    if (!checkReview) return res.status(404).send({ status: false, msg: "No review found for this book id!!" })

    if (checkReview.isDeleted == true) return res.status(400).send({ status: false, msg: "Cann't update review for this book as it is already deleted!" })

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Invalid parameters! Please provide data in request body to update review" })

    if (review) {
        if (!validator.isValid(review)) return res.status(400).send({ status: false, msg: "Review is required and should be a valid string" })
        obj['review'] = review;
    }

    if (rating) {
        if (!validator.isValidRating(rating)) return res.status(400).send({ status: false, msg: "Rating is mandatory and should be a valid integer value" })

        const rat = /^[1-5]$/.test(rating)
        if (rat == false) return res.status(400).send({ status: false, msg: "Rating should be in between 1 to 5" })
        obj['rating'] = rating;
    }


    if (reviewedBy) {
        if (!validator.isValid(reviewedBy)) return res.status(400).send({ status: false, msg: "Reviewd by value should be present and a valid string" })
        obj['reviewedBy'] = reviewedBy;
    }


    let updatedReview = await reviewModel.findByIdAndUpdate({ _id: rId }, { $set: obj }, { new: true }).select({ __v: 0, isDeleted: 0 })

    let final = checkBook.toObject()
    final['reviewsData'] = updatedReview;

    return res.status(200).send({ status: true, msg: "Review updated successfully!", data: final })


}

const deleteReview=async function(req,res){

}










module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview=deleteReview;
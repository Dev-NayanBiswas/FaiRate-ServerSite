const express = require("express");
const asyncErrorHandler = require("../Controllers/asyncErrorHandler.js")
const CustomErrors = require("../Errors/CustomErrors.js")
const {allReviews,ObjectId} = require('../Config/dataBase.js');
const router = express.Router();

router.route("/")
.get(asyncErrorHandler(
    async(req,res,next)=>{
        const {email} = req.query;
        let defaultQuery;

        if(email){
            defaultQuery = {email};
        }
        try{
            const result = await allReviews.find(defaultQuery).toArray();
            res.status(200).send({
                message:"My Reviews Fetched Successfully",
                result:result
            })
        }catch(error){
            next(new CustomErrors("Failed to Load MyReviews", 500))
        }
    }
))
.post(asyncErrorHandler(
    async(req,res, next)=>{
        const userInfo = req.body;
        try{
            const result = await allReviews.insertOne(userInfo);
            res.status(200).send({message:"Review posted Successfully", result: result})
        }catch(error){
            next(new CustomErrors("Failed to Update Service", 500))
        }

    }
))

router.route("/:id")
.delete(asyncErrorHandler(
    async(req,res,next)=>{
        const {id} = req.params;
        try{
            const result = await allReviews.deleteOne({_id: new ObjectId(id)});
            res.status(200).send({
                message:"Successfully Delete Review",
                result:result
            })
        }catch(error){
            next(new CustomErrors("Error in Review Delete", 500))
        }
    }
))
.put(asyncErrorHandler(
    async(req,res,next)=>{
        const {id} = req.params;
        const {comment, rating} = req.body
        const options = {$set:{comment, rating}}
        try{
            const result = await allReviews.updateOne({_id:new ObjectId(id)},options,{upsert:true});
            res.status(200).send({
                message:"Review Updated Successfully",
                result:result
            })
        }catch(error){
            next(new CustomErrors("Error in updating Review", 500))
        }
    }
))



module.exports = router;
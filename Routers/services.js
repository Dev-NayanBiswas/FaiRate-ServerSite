const express = require('express');

const asyncErrorHandler = require("../Controllers/asyncErrorHandler.js")
const CustomErrors = require("../Errors/CustomErrors.js")
const {services,ObjectId} = require('../Config/dataBase.js');
const router = express.Router();


router.route("/")

//! featured Services 
.get(asyncErrorHandler(
    async(req,res,next)=>{
        let defaultLimit;
        let searchQuery = {}
        const {limit, search} = req.query;
        if(limit){
            defaultLimit = limit
        }
        if(search){
            const query = {serviceTitle:{$regex:search, $options:"i"}};
            searchQuery = query
        }
        try{
            const result = await services.find(searchQuery).limit(Number(defaultLimit)).toArray();
            res.status(200).send(result)
        }catch(error){
            next(new CustomErrors("Error in Loading Services",500))
        }
    }
))
.post(asyncErrorHandler(
    async(req, res, next)=>{
        const data = req.body;
        try{
            const result = await services.insertOne(data);
            res.status(200).send({
                message:'Service posted Successfully',
                result:result
            })
        }catch(error){
            next(new CustomErrors("Error in Adding Service",500))
        }
    }
))


router.route("/:id")
.get(asyncErrorHandler(async(req,res,next)=>{
    try{
        const {id} = req.params;
        const result = await services.findOne({_id: new ObjectId(id)});
        res.send(result)
    }catch(error){
        next(new CustomErrors("Error in Getting Details", 500))
    }
}))
.put(asyncErrorHandler(
    async(req,res,next)=>{
        const {id} = req.params;
        const data = req.body;
        const updatedData = {
            $set:{...data}
        }
        try{
            const result = await services.updateOne({_id:new ObjectId(id)},updatedData,{upsert:true});
            res.status(200).send({message:"Successfully Updated", result:result})
        }catch(error){
            next(new CustomErrors("Error in Updating MyServices", 500))
        }
    }
))
.patch(asyncErrorHandler(
    async(req, res, next)=>{
        const {id} = req.params;
        const {count} = req.query;
        if(!ObjectId.isValid(id)){
            throw new CustomErrors("Invalid ID", 400)
        }
        const filter = {_id: new ObjectId(id)};

        let reviewCountEdit;

        if(parseInt(count)===1){
            reviewCountEdit = 1
        }
        if(parseInt(count)===0){
            reviewCountEdit = -1
        }

        const updatedValue = {

            $inc:{reviewCount:reviewCountEdit},
        };
        try{
            const result = await services.updateOne(filter,updatedValue,{upsert:true});
        res.status(200).send({message:"Review Count Updated", result: result})
        }catch(error){
            next(new CustomErrors("Failed to Update Service", 500))
        }
    }
))
.delete(asyncErrorHandler(
    async(req, res, next)=>{
        const{id}=req.params;
        try{
            const result = await services.deleteOne({_id: new ObjectId(id)})
            res.status(200).send({message:"Service Deleted Successfully", result:result})
        }catch(error){
            next(new CustomErrors("Error in Removing Service", 500))
        }
    }
))


module.exports = router;


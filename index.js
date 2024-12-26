const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.CUSTOM_PORT || 8000;


app.use(express.json())
app.use(cookieParser());
app.use(cors())



//! Utilities 
const formateDate = require("./Utilities/formateDate.js")
//! DataBase 
const {allReviews,services} = require('./Config/dataBase.js'); 
//! Custom Error Class 
const CustomErrors = require('./Errors/CustomErrors.js');
//! Global Error Handlers 
const GlobalErrorController = require('./Controllers/GlobalErrorController.js')
const asyncErrorHandler = require('./Controllers/asyncErrorHandler.js');
const { ObjectId } = require('mongodb');







//! featured Services 
app.get("/services", asyncErrorHandler(
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


//!! Get a Specific Service 
app.get("/services/:id",asyncErrorHandler(
    async(req, res, next)=>{
        const {id} = req.params;
        const result = await services.findOne({_id: new ObjectId(id)});
        res.send(result)
    }
))



//! Add Service 
app.post("/addService", asyncErrorHandler(
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


//! Search and Get myServices 
app.get("/myServices", asyncErrorHandler(
    async(req,res,next)=>{
        const {email, search} = req.query;
        if(!email){
            res.status(400).send({message:"Email Required"})
        }
        const filter = {email:email}
        if(search){
            filter.serviceTitle={$regex:search, $options:"i"}
        }
        try{
            const result = await services.find(filter).toArray()
            res.status(200).send({message:"Successfully Data Fetched", result:result})
        }catch(error){
            next(new CustomErrors("Error to fetch My Services",500))
        }
    }
))
//! Update MyServices 
app.put("/updateService/:id", asyncErrorHandler(
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

//! Delete MyService 
app.delete("/myService/:id", asyncErrorHandler(
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


//! Updating or Adding  Review Count
app.patch("/services/:id", asyncErrorHandler(
    async(req, res, next)=>{
        const {id} = req.params;
        if(!ObjectId.isValid(id)){
            throw new CustomErrors("Invalid ID", 400)
        }
        const filter = {_id: new ObjectId(id)};
        const updatedValue = {
            // $setOnInsert: {reviewCount:1},
            $inc:{reviewCount:1},
        };
        try{
            const result = await services.updateOne(filter,updatedValue,{upsert:true});
        res.status(200).send({message:"Review Count Updated", result: result})
        }catch(error){
            next(new CustomErrors("Failed to Update Service", 500))
        }
    }
))

//! Adding Reviews 
app.post("/allReviews", asyncErrorHandler(
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

//! Get MyReviews 
app.get("/myReviews", asyncErrorHandler(
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

//! Get Service Reviews 
app.get("/serviceReviews", asyncErrorHandler(
    async(req,res,next)=>{
        const {serviceID} = req.query;
        
        let defaultQuery;

        if(serviceID){
            const filter = {serviceID}
            defaultQuery = filter
        }
        try{
            const result = await allReviews.find(defaultQuery).toArray();
            res.status(200).send({
                message:"Review Fetched Successfully",
                result:result
            })
        }catch(error){
            next(new CustomErrors("Failed to Load Reviews", 500))
        }
    }
))
 

//! Delete MyReview 
app.delete("/myReviews/:id", asyncErrorHandler(
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

//! Update MyReview 
app.put("/updateReview/:id", asyncErrorHandler(
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


//!404  notFound Error
app.use((req,res,next)=>{
    const err = new CustomErrors(`Can't find ${req.originalUrl} on Server!`, 404);
    next(err);
})


//! Global Error 
app.use(GlobalErrorController)



app.listen(PORT)

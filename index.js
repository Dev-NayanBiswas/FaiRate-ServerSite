const express = require('express')
const cors = require('cors');
const JWT = require('jsonwebtoken');
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
const {allReviews,services} = require('./Config/dataBase.js') 
//! Custom Error Class 
const CustomErrors = require('./Errors/CustomErrors.js');
//! Global Error Handlers 
const GlobalErrorController = require('./Controllers/GlobalErrorController.js')
const asyncErrorHandler = require('./Controllers/asyncErrorHandler.js');
const { ObjectId } = require('mongodb');





//! AllServices 
app.get("/services", asyncErrorHandler(
    async(req,res,next)=>{
        let defaultLimit;
        const {limit} = req.query;
        if(limit){
            defaultLimit = limit
        }
        const result = await services.find({}).limit(Number(defaultLimit)).toArray();
        res.status(200).send(result)
    }
))

app.get("/services/:id",asyncErrorHandler(
    async(req, res, next)=>{
        const {id} = req.params;
        const result = await services.findOne({_id: new ObjectId(id)});
        res.send(result)
    }
))

app.get("/faiRate", asyncErrorHandler(
    async(req,res, next)=>{
            const allData = await allReviews.find({}).toArray();
            res.send(allData)
    }
))

app.post("/faiRate", asyncErrorHandler(
    async(req, res, next)=>{
        const myEmail = 'mr.nayan.biswas@gmail.com'
        const data = {
            email:myEmail,
            postedBy:"Nayan",
            postedOn: formateDate(),
            reviewCount:0,
            updatedOn:false,

        }
        if(!data){
            throw new CustomErrors("Nothing Founded", 400)
        }
        const result = await allReviews.insertOne(data);
        res.status(200).send(result)
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
        res.send("Hitting All Reviews")
    }
))



//!404  Found Error
app.use((req,res,next)=>{
    const err = new CustomErrors(`Can't find ${req.originalUrl} on Server!`, 404);
    next(err);
})


//! Global Error 
app.use(GlobalErrorController)



app.listen(PORT,()=>{
    console.log("FaiRate is Running on PORT", PORT)
})



// let defaultOption = {};
//     const { searchQuery } = req.query;
//     const searchOption = { title: { $regex: searchQuery, $options: "i" } };
//     if (searchQuery) {
//       defaultOption = searchOption;
//     }
//     const bulkMovies = await allMovies.find(defaultOption).toArray();
//     res.send(bulkMovies);


// const ID = req.params.ID;
//     const specificIdentity = { _id: new ObjectId(ID) };
//     const { title, summary, rating, release, genre, thumbnail } = req.body;
//     const updatedValue = {
//       $set: { title, summary, rating, release, genre, thumbnail },
//     };
//     const updateInDB = await allMovies.updateOne(
//       specificIdentity,
//       updatedValue,
//       { upsert: true },
//     );



// const getMovies = await allMovies
//       .find()
//       .sort({ rating: -1 })
//       .limit(6)
//       .toArray();
//     res.send(getMovies);
//   } catch (error) {
//     next(error);
//   }
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
const {allReviews} = require('./Config/dataBase.js') 
//! Custom Error Class 
const CustomErrors = require('./Errors/CustomErrors.js');
//! Global Error Handlers 
const GlobalErrorController = require('./Controllers/GlobalErrorController.js')
const asyncErrorHandler = require('./Controllers/asyncErrorHandler.js')





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
            time: formateDate()
        }
        if(!data){
            throw new CustomErrors("Nothing Founded", 400)
        }
        const result = await allReviews.insertOne(data);
        res.status(200).send(result)
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
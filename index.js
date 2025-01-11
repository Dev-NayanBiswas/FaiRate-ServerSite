const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.CUSTOM_PORT || 8000;


app.use(express.json())
app.use(cookieParser());
app.use(cors())


//! Custom Error Class 
const CustomErrors = require('./Errors/CustomErrors.js');
//! Global Error Handlers 
const GlobalErrorController = require('./Controllers/GlobalErrorController.js')


const serviceRouters = require("./Routers/services.js");
const reviewRouters = require("./Routers/reviews.js");
const myServiceRouter = require("./Routers/myServices.js");
const serviceReviewRouter = require("./Routers/serviceReviews.js");



app.use("/services", serviceRouters)
app.use("/reviews", reviewRouters)
app.use("/myServices",myServiceRouter)
app.use("/serviceReviews",serviceReviewRouter)



//!404  notFound Error
app.use((req,res,next)=>{
    const err = new CustomErrors(`Can't find ${req.originalUrl} on Server!`, 404);
    next(err);
})


//! Global Error 
app.use(GlobalErrorController)



app.listen(PORT)

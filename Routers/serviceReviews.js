const express = require("express");
const asyncErrorHandler = require("../Controllers/asyncErrorHandler.js")
const CustomErrors = require("../Errors/CustomErrors.js")
const {allReviews,ObjectId} = require('../Config/dataBase.js');
const { route } = require("./services.js");
const router = express.Router();


router.route("/")
.get(asyncErrorHandler(
    async(req,res,next)=>{
        const {serviceID} = req.query;
        
        let defaultQuery;

        if(serviceID){
            const filter = {serviceID:serviceID}
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

module.exports = router;
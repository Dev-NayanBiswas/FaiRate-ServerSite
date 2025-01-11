const express = require('express');

const asyncErrorHandler = require("../Controllers/asyncErrorHandler.js")
const CustomErrors = require("../Errors/CustomErrors.js")
const {services,ObjectId} = require('../Config/dataBase.js');
const router = express.Router();


router.route("/")

//! featured Services 
.get(asyncErrorHandler(
    async(req,res,next)=>{
        console.log("Running Locally");
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


router.route("/:id")
.get(asyncErrorHandler(async(req,res,next)=>{
    try{
        const {id} = req.params;
        console.log(id);
        const result = await services.findOne({_id: new ObjectId(id)});
        res.send(result)
    }catch(error){
        next(new CustomErrors("Error in Getting Details", 500))
    }
}))


module.exports = router;


const express = require('express');

const asyncErrorHandler = require("../Controllers/asyncErrorHandler.js")
const CustomErrors = require("../Errors/CustomErrors.js")
const {services,ObjectId} = require('../Config/dataBase.js');
const router = express.Router();


router.route("/")
.get(asyncErrorHandler(
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





module.exports = router;
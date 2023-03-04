const router = require('express').Router();

const Pin = require("../db/Pin");

//create a pin
router.post('/',async (req,resp)=>{
    const newPin = new Pin(req.body);
    try{
       const savedPin = await newPin.save();
       resp.status(200).json(savedPin);
    }catch(err){
        resp.status(500).json(err);
    }
})


//get all pins

router.get('/',async(req,resp)=>{
    try{
        const pins = await Pin.find();
        resp.status(200).json(pins);
    }catch(err){
        resp.status(500).json(err);
    }
})

module.exports  = router
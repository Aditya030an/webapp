import neurologicalFormModel from "../models/neurologicalAssessmentModels.js";
import musculoskeletalFormModel from "../models/musculoskeletalAssessmentModels.js";
import obesityFormModel from "../models/obesityAssessmentModels.js";
import pilatesFormModel from "../models/pilatesAssessmentModels.js";
import enquiryModel from "../models/enquiryModels.js";

const getNeurologicalClient = async(req , res)=>{
    try{
        const contactNumber = req?.contactNumber;
            const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });
        
            const enquiryId = enquiryPersonalDetails?.[0]?._id;
        const response = await neurologicalFormModel?.find().populate("enquiryId");
        console.log("neurolodical data client" , response);

        res.status(200).json({response});
    }catch(err){
        console.log(err);
    }
}

const getMusculoskeletalClient = async(req , res)=>{
    try{
        const contactNumber = req?.contactNumber;
            const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });
        
            const enquiryId = enquiryPersonalDetails?.[0]?._id;
        const response = await musculoskeletalFormModel?.find().populate("enquiryId");
        // console.log("musculoskeletalFormModel data client" , response);

        res.status(200).json({response});
    }catch(err){
        console.log(err);
    }
}

const getObesityClient = async(req , res)=>{
    try{
        const contactNumber = req?.contactNumber;
            const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });
        
            const enquiryId = enquiryPersonalDetails?.[0]?._id;
        const response = await obesityFormModel?.find().populate("enquiryId");
        console.log("obesityFormModel data client" , response);

        res.status(200).json({response});
    }catch(err){
        console.log(err);
    }
}

const getPilatesClient = async(req , res)=>{
    try{
        const contactNumber = req?.contactNumber;
            const enquiryPersonalDetails = await enquiryModel?.find({ contactNumber });
        
            const enquiryId = enquiryPersonalDetails?.[0]?._id;
        const response = await pilatesFormModel?.find().populate("enquiryId");
        console.log("pilatesFormModel data client" , response);

        res.status(200).json({response});
    }catch(err){
        console.log(err);
    }
}   


export { getNeurologicalClient , getMusculoskeletalClient , getObesityClient , getPilatesClient };
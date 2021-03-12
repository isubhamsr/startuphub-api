const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    gender : {
        type : String,
        required : true
    },
    uniqueId : {
        type : String,
        required : true,
        default : Date.now()
    },
    token : {
        type : String,
        default : ""
    },
    isActive : {
        type : Boolean,
        default : false
    },
    isSuperAdmin : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isModerator : {
        type : Boolean,
        default : false
    },
    isStuff : {
        type : Boolean,
        default : false
    },
    isStudent : {
        type : Boolean,
        default : false
    },
    isWorkingPerson : {
        type : Boolean,
        default : false
    },
    isPropertyOwner : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

mongoose.model('User', userSchema)

import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
      fullName:{
            type:String,
            required:[true,"Name is required"],
      },
      email:{
            type:String,
            required:[true,"Email is required"],
            unique:true
      },
      password:{
            type:String,
            required:[true,"Password is required"],
            minLength:[6,"Password must be at least 6 characters long"]
      },
      profilePic:{
            type:String,
            required:false,
            default:null,
      },
      bio:{
            type:String,
            required:false,
            default:"Hey there! I am using GupShup",
      }
})

userSchema.pre("save", async function(next){
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt)
      next()
})

const User = mongoose.model("User", userSchema);
export default User
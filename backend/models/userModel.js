import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email address"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email address",
      ],
    },

    role: {
      type: String,
      enum: ["Parent", "Teacher", "Finance", "Admissions", "Admin"],
      required: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    profilePicture: {
      type: String,
      default: "default-avatar.png",
    },
    firstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}
const UserModel = mongoose.model("User", userSchema);
export default UserModel;

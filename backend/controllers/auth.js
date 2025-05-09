import asyncHandler from "../middleware/asyncHandler.js";
import ErrorHandler from "../util/errorResponse.js";
import User from "../models/userModel.js";

// @desc     Register user
// @route    POST /api/v1/register
// @access   Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  // Validate fields
  if (!name || !phone || !email || !password || !role) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Check if user exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exists", 400));
  }

  // Password length check
  if (password.length < 8) {
    return next(
      new ErrorHandler("Password should be more than 8 characters", 400)
    );
  }

  // Create user
  const user = await User.create({ name, email, password, role, phone });


  //create token 

  const token = user.getSignedJwtToken();
 res.status(201).json({
   success: true,
   message: "User registered successfully",
   token,
   user: {
     id: user._id,
     name: user.name,
     email: user.email,
     role: user.role,
   },
 });

});

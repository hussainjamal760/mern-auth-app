const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemail");
const {EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE} = require('../config/emailTemplates')

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Information" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome from H AUTH APP',
        text:`Welcome to H AUTH APP . Your account has been created with email id ${email}`
    }

    await transporter.sendMail(mailOptions)

    return res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password both are needed",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId}= req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success:false , message : "Account Already Verified"})
        }

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const otpString = otp.toString();

        console.log("Generated OTP:", otpString); 

        user.verifyOtp = otpString;
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000; 

        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}" , user.email)
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true , message :"Verification OTP Sent" });

    } catch (error) {
        res.json({success:false , message : error.message})
    }
}

const verifyEmail = async (req , res)=>{
    const {userId, otp} = req.body

    if(!userId || !otp){
        return res.json({success: false , message:"Missing details"})
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false , message:"User not Found"})
        }

        const storedOtp = String(user.verifyOtp || '').trim();
        const receivedOtp = String(otp).trim();

        if (!storedOtp || storedOtp !== receivedOtp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false , message:"OTP Expired"})
        }   

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true , message:"Email Verified Successfully"})

    } catch (error) {
         return res.json({success: false , message:error.message})
    }
}

const isAuthenticated = async (req , res)=>{
  try {
    return res.json({success: true , message : "User Already Authenticated"})
  } catch (error) {
    return res.json({success: false , message:error.message})
  }
}

const sendResetOtp = async(req, res)=>{
   const {email} = req.body

   if(!email) return res.json({success:false , message : "Email Required"})

  try {
      const user = await userModel.findOne({email})

    if(!user) return res.json({success:false , message : "User not Found"})

       const otp = Math.floor(Math.random() * 900000) + 100000;
        const otpString = otp.toString();

        user.resetOtp = otpString;
        user.resetOtpExpireAt = Date.now() + 15*60*1000; 

        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Reset your Password OTP',
             html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otpString).replace("{{email}}" , user.email)
        }

        await transporter.sendMail(mailOptions);

   return res.json({success:true , message : "OTP sent to your email"})


  } catch (error) {
   return res.json({success:false , message : error.message})
  }
}

const resetPassword = async(req, res)=>{
   const {email , otp,newPassword} = req.body

   if(!email || !otp || !newPassword){
    return res.json({success:false , message : "Email , OTP , NewPassword Required"})
   }

   try {
    const user = await userModel.findOne({email})

    if(!user) {
      return res.json({success:false , message : "User not Found"})
    }

   if (user.resetOtp === "" || user.resetOtp !== otp) {

      return res.json({success:false , message : "Invalid Otp"})
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false , message : "OTP Expired"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password= hashedPassword 
    user.resetOtp = ""
    user.resetOtpExpireAt = 0;

    await user.save()

   return res.json({success:true , message : "Password reset successfully"})

   } catch (error) {
     return res.json({success:false , message : error.message})
   }

}


const verifyResetOtp = async(req, res) => {
   const {email, otp} = req.body

   if(!email || !otp){
    return res.json({success:false , message : "Email and OTP Required"})
   }

   try {
    const user = await userModel.findOne({email})

    if(!user) {
      return res.json({success:false , message : "User not Found"})
    }

    const storedOtp = String(user.resetOtp || '').trim();
    const receivedOtp = String(otp).trim();

    if (!storedOtp || storedOtp !== receivedOtp) {
      return res.json({success:false , message : "Invalid OTP"})
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success:false , message : "OTP Expired"})
    }

    return res.json({success:true , message : "OTP verified successfully"})

   } catch (error) {
     return res.json({success:false , message : error.message})
   }
}

module.exports = {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  verifyResetOtp, 
  resetPassword
};

<<<<<<< HEAD
import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
export function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(400).json({ success: false, message: "Please Login" });
=======
import jwt from 'jsonwebtoken';
import config from '../config/config.mjs';

export function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Please Login' });
>>>>>>> 6e2bdb14bea3d95a1e5393a32f16135f6768e820
  } else {
    try {
      const { data } = jwt.verify(token, config.secretKey);
      console.log(data);
      req.employeeNumber = data.employeeNumber;
      req.customerNumber = data.customerNumber;
      req.role = data.role;
      req.officeCode = data.officeCode;
      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export function isAccess(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
<<<<<<< HEAD
      res.json({
        success: false,
        message: "You do not have permission to access",
      });
=======
      res.status(403).json({ success: false, message: 'You do not have permission to access' });
>>>>>>> 6e2bdb14bea3d95a1e5393a32f16135f6768e820
    } else {
      next();
    }
  };
}

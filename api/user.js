const express = require("express");
const router = express.Router();
const UserModel = require("../modal/UserModal");
const bcrypt = require("bcrypt");
const webToken = require("jsonwebtoken");
require("dotenv").config()

// Register APi
router.post("/register", function (req, res) {
  const {
    username,
    password,
    email
  } = req.body;
  if (
    username == undefined ||
    username == "" ||
    password == undefined ||
    password == "" ||
    email == undefined ||
    email == ""
  ) {
    res.status(401).json({
      message: "Fill All Fields",
      status: res.statusCode,
    });
  } else {
    UserModel.findOne({
      attributes: ["user_name"],
      where: {
        email,
      },
    }).then((value) => {
      if (value === null) {
        //HASH THE PASSWORD
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            // CRETAE RECORD IN DB
            UserModel.create({
                user_name: username,
                email: email,
                password: hash,
              })
              .then((value) =>
                res.status(201).json({
                  message: "Account Has Created Successfully",
                  status: res.statusCode,
                })
              )
              .catch((err) =>
                res.status(404).json({
                  message: "Something went wrong",
                  status: res.statusCode,
                })
              );
          });
        });
      } else {
        res.status(401).json({
          message: "Email already Taken",
          status: res.statusCode,
        });
      }
    });
  }
});

module.exports = router;
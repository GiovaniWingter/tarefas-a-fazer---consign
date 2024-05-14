const env = require("dotenv").config();
const mysql = require('mysql2')
const { body, validationResult } = require("express-validator");
exports.mysql = mysql;
exports.body = body;
exports.validationResult = validationResult;
exports.moment = require("moment");
exports.express = require("express");
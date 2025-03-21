"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Register_1 = require("../../controller/Auth/Register");
const router = (0, express_1.Router)();
router.post('/register', Register_1.Register);
exports.default = router;

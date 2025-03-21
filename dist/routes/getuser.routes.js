"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetUsers_1 = require("../controller/GetUsers");
const router = (0, express_1.Router)();
router.get('/', GetUsers_1.getTop5UsersWithMostPosts);
exports.default = router;

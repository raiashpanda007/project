"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetPosts_1 = __importDefault(require("../controller/GetPosts"));
const router = (0, express_1.Router)();
router.get('/', (GetPosts_1.default));

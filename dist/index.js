"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, tokens, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'communityid', 'userid', 'postid'], // Allowed headers
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
const getuser_routes_1 = __importDefault(require("./routes/getuser.routes"));
app.use('/users', getuser_routes_1.default);
const GetPosts_1 = __importDefault(require("./controller/GetPosts"));
app.use('/posts', GetPosts_1.default);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

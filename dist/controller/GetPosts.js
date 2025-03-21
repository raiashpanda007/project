"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const BASE_URL = "http://20.244.56.144/test"; // API Base URL
const getPopularPost = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = process.env.AUTH_TOKEN; // Fetch token from .env
    if (!authToken) {
        return res.status(500).json({ success: false, message: "Missing AUTH_TOKEN in environment variables" });
    }
    try {
        // Step 1: Fetch all users
        const usersResponse = yield axios_1.default.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        const users = usersResponse.data.users; // Fetch users from API
        console.log("Users:", users);
        // Step 2: Fetch posts for each user
        let allPosts = [];
        for (const userId in users) {
            try {
                const userPostsResponse = yield axios_1.default.get(`${BASE_URL}/users/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                allPosts = allPosts.concat(userPostsResponse.data); // Append to post list
            }
            catch (error) {
                console.error(`Failed to fetch posts for user ${userId}:`, error.message);
            }
        }
        // Step 3: Fetch comments for each post and attach the count
        const postsWithComments = yield Promise.all(allPosts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const commentsResponse = yield axios_1.default.get(`${BASE_URL}/posts/${post.id}/comments`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                return Object.assign(Object.assign({}, post), { commentCount: commentsResponse.data.length });
            }
            catch (error) {
                console.error(`Failed to fetch comments for post ${post.id}:`, error.message);
                return Object.assign(Object.assign({}, post), { commentCount: 0 });
            }
        })));
        // Step 4: Sort posts by comment count (descending order)
        const sortedPosts = postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
        res.json({ success: true, posts: sortedPosts });
    }
    catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
}));
exports.default = getPopularPost;

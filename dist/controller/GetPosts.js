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
const getPosts = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTcwNjMwLCJpYXQiOjE3NDI1NzAzMzAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsInN1YiI6ImthcmFuLjIyMDExNDVlY0BpaWl0YmguYWMuaW4ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsImNsaWVudFNlY3JldCI6Ik1kQXBlVHZvUGFtQnNWemMiLCJvd25lck5hbWUiOiJLYXJhbiIsIm93bmVyRW1haWwiOiJrYXJhbi4yMjAxMTQ1ZWNAaWlpdGJoLmFjLmluIiwicm9sbE5vIjoiMjIwMTE0NWVjIn0.a7zAE3_1qjz5lPCDMw9MQ6kh44jZxqJcBplEG0gudRg';
    if (!authToken) {
        return res.status(500).json({ success: false, message: "Missing AUTH_TOKEN in environment variables" });
    }
    const { type } = req.query; // Get query parameter
    if (!type || (type !== "latest" && type !== "popular")) {
        return res.status(400).json({ success: false, message: "Invalid type parameter. Use 'latest' or 'popular'." });
    }
    try {
        // Step 1: Fetch all users
        const usersResponse = yield axios_1.default.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        const users = usersResponse.data.users;
        console.log("Users:", users);
        // Step 2: Fetch posts for each user
        let allPosts = [];
        for (const userId in users) {
            try {
                const userPostsResponse = yield axios_1.default.get(`${BASE_URL}/users/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                allPosts = allPosts.concat(userPostsResponse.data);
            }
            catch (error) {
                console.error(`Failed to fetch posts for user ${userId}:`, error.message);
            }
        }
        if (type === "popular") {
            // Step 3A: Fetch comments and sort by comment count
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
            // Sort posts by comment count in descending order
            allPosts = postsWithComments.sort((a, b) => b.commentCount - a.commentCount);
        }
        else if (type === "latest") {
            // Step 3B: Sort posts by creation date (assuming `createdAt` field exists)
            allPosts = allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        res.json({ success: true, posts: allPosts });
    }
    catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
}));
exports.default = getPosts;

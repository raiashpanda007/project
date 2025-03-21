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
exports.getTop5UsersWithMostPosts = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const axios_1 = __importDefault(require("axios"));
exports.getTop5UsersWithMostPosts = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTY3NTcxLCJpYXQiOjE3NDI1NjcyNzEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsInN1YiI6ImthcmFuLjIyMDExNDVlY0BpaWl0YmguYWMuaW4ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsImNsaWVudFNlY3JldCI6Ik1kQXBlVHZvUGFtQnNWemMiLCJvd25lck5hbWUiOiJLYXJhbiIsIm93bmVyRW1haWwiOiJrYXJhbi4yMjAxMTQ1ZWNAaWlpdGJoLmFjLmluIiwicm9sbE5vIjoiMjIwMTE0NWVjIn0.9FAbt32QTx0yc_ojh_C5yZM1CeTaAj0FczuarGmHFQ8`;
    // Step 1: Fetch all users
    const response = yield axios_1.default.get("http://20.244.56.144/test/users", {
        headers: { Authorization: authToken }
    });
    const users = Object.entries(response.data.users).map(([id, name]) => ({ id, name }));
    // Step 2: Fetch posts for each user
    const usersWithPosts = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postsResponse = yield axios_1.default.get(`http://20.244.56.144/test/users/${user.id}/posts`, {
                headers: { Authorization: authToken }
            });
            return Object.assign(Object.assign({}, user), { postCount: postsResponse.data.posts.length });
        }
        catch (error) {
            console.error(`Failed to fetch posts for user ${user.id}:`, error);
            return Object.assign(Object.assign({}, user), { postCount: 0 });
        }
    })));
    // Step 3: Sort users by post count (descending order) and take top 5
    const top5Users = usersWithPosts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
    return res.json({ users: top5Users });
}));

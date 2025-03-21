import axios from "axios";
import asyncHandler from "../utils/asyncHandler";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const BASE_URL = "http://20.244.56.144/test"; // API Base URL

const getPopularPost = asyncHandler(async (req: any, res: any) => {
    const authToken = process.env.AUTH_TOKEN; // Fetch token from .env

    if (!authToken) {
        return res.status(500).json({ success: false, message: "Missing AUTH_TOKEN in environment variables" });
    }

    try {
        // Step 1: Fetch all users
        const usersResponse = await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        const users: Record<string, string> = usersResponse.data.users; // Fetch users from API
        console.log("Users:", users);

        // Step 2: Fetch posts for each user
        let allPosts: any[] = [];

        for (const userId in users) {
            try {
                const userPostsResponse = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                allPosts = allPosts.concat(userPostsResponse.data); // Append to post list
            } catch (error: any) {
                console.error(`Failed to fetch posts for user ${userId}:`, error.message);
            }
        }

        // Step 3: Fetch comments for each post and attach the count
        const postsWithComments = await Promise.all(
            allPosts.map(async (post: any) => {
                try {
                    const commentsResponse = await axios.get(`${BASE_URL}/posts/${post.id}/comments`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    });

                    return { ...post, commentCount: commentsResponse.data.length };
                } catch (error: any) {
                    console.error(`Failed to fetch comments for post ${post.id}:`, error.message);
                    return { ...post, commentCount: 0 };
                }
            })
        );

        // Step 4: Sort posts by comment count (descending order)
        const sortedPosts = postsWithComments.sort((a: any, b: any) => b.commentCount - a.commentCount);

        res.json({ success: true, posts: sortedPosts });
    } catch (error: any) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch data" });
    }
});

export default getPopularPost;

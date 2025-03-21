import asyncHandler from "../utils/asyncHandler";
import axios from "axios";

interface User {
    id: string;
    name: string;
    postCount: number;
}

export const getTop5UsersWithMostPosts = asyncHandler(async (req, res) => {
    const authToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTY3NTcxLCJpYXQiOjE3NDI1NjcyNzEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsInN1YiI6ImthcmFuLjIyMDExNDVlY0BpaWl0YmguYWMuaW4ifSwiY29tcGFueU5hbWUiOiJnb01hcnQiLCJjbGllbnRJRCI6IjQ3ODk2OTYyLTcxMjgtNGE3Mi1hZjkxLTkzYjUzMWI1MzdlZCIsImNsaWVudFNlY3JldCI6Ik1kQXBlVHZvUGFtQnNWemMiLCJvd25lck5hbWUiOiJLYXJhbiIsIm93bmVyRW1haWwiOiJrYXJhbi4yMjAxMTQ1ZWNAaWlpdGJoLmFjLmluIiwicm9sbE5vIjoiMjIwMTE0NWVjIn0.9FAbt32QTx0yc_ojh_C5yZM1CeTaAj0FczuarGmHFQ8`;

    // Step 1: Fetch all users
    const response = await axios.get<{ users: Record<string, string> }>("http://20.244.56.144/test/users", {
        headers: { Authorization: authToken }
    });

    const users = Object.entries(response.data.users).map(([id, name]) => ({ id, name }));

    // Step 2: Fetch posts for each user
    const usersWithPosts = await Promise.all(users.map(async (user) => {
        try {
            const postsResponse = await axios.get<{ posts: any[] }>(`http://20.244.56.144/test/users/${user.id}/posts`, {
                headers: { Authorization: authToken }
            });

            return { ...user, postCount: postsResponse.data.posts.length };
        } catch (error) {
            console.error(`Failed to fetch posts for user ${user.id}:`, error);
            return { ...user, postCount: 0 };
        }
    }));

    // Step 3: Sort users by post count (descending order) and take top 5
    const top5Users = usersWithPosts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);

    return res.json({ users: top5Users });
});

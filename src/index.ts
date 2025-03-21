import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser());
app.use(
    cors({
      origin: 'http://localhost:5173', // Your frontend URL
      credentials: true, // Allow credentials (cookies, tokens, etc.)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token','communityid','userid','postid'], // Allowed headers
    })
  );

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));  
import getUserRoutes from './routes/getuser.routes'
app.use('/users',getUserRoutes)
import getPopularPost from './controller/GetPosts'
app.use('/posts',getPopularPost)

app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})



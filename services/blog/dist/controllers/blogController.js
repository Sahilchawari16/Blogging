import { redisClient } from "../server.js";
import TryCatch from "../utils/TryCatch.js";
import { sql } from "../utils/db.js";
import axios from "axios";
export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery = "", category = "" } = req.query;
    const cachekey = `blogs:${searchQuery}:${category}`;
    const cached = await redisClient.get(cachekey);
    if (cached) {
        console.log("Serving from redis");
        res.json(cached);
        return;
    }
    let blogs;
    if (searchQuery && category) {
        blogs = await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) 
        AND category = ${category} ORDER BY created_at DESC`;
    }
    else if (searchQuery) {
        blogs = await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) 
        ORDER BY created_at DESC`;
    }
    else if (category) {
        blogs = await sql `SELECT * FROM blogs WHERE category = ${category} 
        ORDER BY created_at DESC`;
    }
    else {
        blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;
    }
    console.log("Serving from db");
    await redisClient.set(cachekey, JSON.stringify(blogs), { ex: 36000 });
    res.json(blogs);
});
export const getSingleBlog = TryCatch(async (req, res) => {
    const blogid = req.params.id;
    const cachekey = `blog:${blogid}`;
    const cached = await redisClient.get(cachekey);
    if (cached) {
        console.log("Serving single blog from redis");
        res.json(cached);
        return;
    }
    const blog = await sql `SELECT * FROM blogs WHERE id = ${blogid}`;
    if (blog.length === 0) {
        res.status(404).json({
            message: "No blog from this id"
        });
        return;
    }
    const { data } = await axios(`${process.env.USER_SERVICE}/api/v1/user/${blog[0].author}`);
    console.log("Serving from db");
    const responseData = { blog: blog[0], author: data };
    await redisClient.set(cachekey, JSON.stringify(responseData), { ex: 36000 });
    res.json(responseData);
});

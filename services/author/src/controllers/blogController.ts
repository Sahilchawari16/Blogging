import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from 'cloudinary';
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitmq.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

export const createBlog = TryCatch(async (req: AuthenticatedRequest, res) => {

    const { title, description, blogcontent, category } = req.body
    const file = req.file

    if (!file) {
        res.status(400).json({
            message: "No File To Upload"
        });
        return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed TO Generate Buffer"
        });
        return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    })

    const result = await sql`INSERT INTO blogs (title, description, image, blogcontent, category,author ) VALUES(
    ${title}, ${description}, ${cloud.secure_url} ,${blogcontent}, ${category}, ${req.user?._id}
    ) RETURNING *`

    await invalidateCacheJob(["blogs:*"]);

    res.json({
        message: "Blog Created",
        blog: result[0],
    });

});

export const updateBlog = TryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params
    const { title, description, blogcontent, category } = req.body

    const file = req.file

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`

    if (!blog.length) {
        res.status(404).json({
            message: "No Blog With This Id"
        })

        return;
    }

    if (blog[0].author !== req.user?._id) {
        res.status(401).json({
            message: "You are not the author of this blog",
        })

        return;
    }

    let imageUrl = blog[0].image

    if (file) {
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(400).json({
                message: "Failed TO Generate Buffer"
            });
            return;
        }

        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "blogs"
        })

        imageUrl = cloud.secure_url
    }

    const updatedBlog = await sql`UPDATE blogs SET
    title = ${title || blog[0].title},
    description = ${description || blog[0].description},
    image = ${imageUrl},
    blogcontent = ${blogcontent || blog[0].blogcontent},
    category = ${category || blog[0].category}

    WHERE id = ${id}
    RETURNING *
    `;

    await invalidateCacheJob(["blogs:*", `blog:${id}`]);

    res.json({
        message: "Blog Updated",
        blog: updatedBlog[0]
    })
});

export const deletedblog = TryCatch(async (req: AuthenticatedRequest, res) => {
    const blog = await sql`SELECT * FROM blogs WHERE id = ${req.params.id}`;

    if (!blog.length) {
        res.status(404).json({
            message: "No Blog With This Id"
        })

        return;
    }

    if (blog[0].author !== req.user?._id) {
        res.status(401).json({
            message: "You are not the author of this blog",
        })

        return;
    }

    await sql`DELETE FROM savedblogs WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM comments WHERE blogid = ${req.params.id}`;
    await sql`DELETE FROM blogs WHERE id = ${req.params.id}`;

    await invalidateCacheJob(["blogs:*", `blog:${req.params.id}`]);

    res.json({
        message: "Blog Deleted",
    });
});

export const aiTitleResponse = TryCatch(async (req, res) => {
  const { text } = req.body;

  const prompt = `Correct the grammar of the following blog title and return only the corrected title without any additional text, formatting, or symbols: "${text}"`;

  let result;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let rawtext = response.text;

    if (!rawtext) {
      res.status(400).json({
        message: "Something went wrong",
      });
      return;
    }

    result = rawtext
      .replace(/\*\*/g, "")
      .replace(/[\r\n]+/g, "")
      .replace(/[*_`~]/g, "")
      .trim();
  }

  await main();

  res.json(result);
});
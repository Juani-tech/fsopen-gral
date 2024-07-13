const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  // const blog = await Blog.find({}).populate("user");
  const blog = await Blog.find({}).populate("user").populate("comments");
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;

  if (!request.user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  if (!body.title || !body.url) {
    response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id,
    comments: [],
  });

  const savedBlog = await blog.save();
  request.user.blogs = request.user.blogs.concat(savedBlog._id);
  console.log("Blogs: ", request.user.blogs);

  await request.user.save();

  const populatedBlog = await savedBlog.populate("user");

  response.status(201).json(populatedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    if (!request.user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== request.user.id) {
      return response.status(401).json({ error: "unauthorized user" });
    }

    await Blog.findByIdAndDelete(request.params.id);

    const user = await User.findById(request.user.id);
    user.blogs = user.blogs.filter(
      (blog) => blog.id.toString() !== request.params.id
    );
    await user.save();

    response.status(204).end();
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const updatedLikes = body.likes;

  // Chain of populate works if it's made with the mongoose Query
  Blog.findByIdAndUpdate(
    request.params.id,
    { likes: updatedLikes },
    { new: true }
  )
    .populate("comments")
    .populate("user")
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => {
      console.log("Error when applying like ", error);
      response.status(500).json({ error: error });
    });
});

// Comments endpoint
blogsRouter.post("/:id/comments", async (request, response) => {
  try {
    const body = request.body;
    const content = body.content;
    console.log("content: ", content);
    const blogId = request.params.id;

    if (!blogId) {
      return response.status(404).json({ error: "Blog post not found" });
    }

    const comment = new Comment({
      content,
      blogCommented: blogId,
    });

    const savedComment = await comment.save();

    const blog = await Blog.findById(blogId);
    blog.comments = blog.comments.concat(savedComment._id);

    await blog.save();

    // Popular con user?
    response.status(201).json(comment);
  } catch (error) {
    console.log("Error: ", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = blogsRouter;

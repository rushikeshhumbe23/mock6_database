const express = require("express");
const BlogModel = require("../model/blogModel");
const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
  const { userID } = req.body.userID;
  try {
    const { filter, sortBy, q } = req.query;
    const query = { userID };
    if (filter && filter.title) query.title = filter.title;
    if (filter && filter.category) query.category = filter.category;
    if (q) {
      query.title = { $regex: q, $options: "i" };
    }
    const sort = sortBy ? { date: 1 } : {};
    const blogs = await BlogModel.find(query).sort(sort);
    return res.status(200).json({ msg: "Your Blogs", blogs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

blogRouter.post("/", async (req, res) => {
  const date = Date.now().toString();
  try {
    const newBlog = await BlogModel({
      ...req.body,
      date,
      likes: 0,
      comments: [],
    }).save();
    return res.status(200).json({ msg: "new blog cteated", newBlog });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

blogRouter.patch("/:blogid", async (req, res) => {
  const { userID } = req.body;
  const { blogid } = req.params;
  try {
    const blog = await BlogModel.findById({ _id: blogid });
    const inneruserID = blog.userID;
    if (userID == inneruserID) {
      const updatedBlog = await BlogModel.findByIdAndUpdate(
        { _id: blogid },
        req.body,
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "Blog has been updated successfully", updatedBlog });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
blogRouter.delete("/:blogid", async (req, res) => {
  const { userID } = req.body;
  const { blogid } = req.params;
  try {
    const blog = await BlogModel.findById({ _id: blogid });
    const inneruserID = blog.userID;
    if (userID == inneruserID) {
      const deletedBlog = await BlogModel.findByIdAndDelete({ _id: blogid });
      return res
        .status(200)
        .json({ msg: "Blog has been deleted successfully", deletedBlog });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = blogRouter;

import Post from '../models/postModel.js';

export const getAllPosts = async (req, res) => {
  try {
    console.log('Fetching all posts...');
    const posts = await Post.find()
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });
    console.log('Posts found:', posts.length);
    res.json(posts);
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const post = await Post.create({
      title,
      content,
      type,
      author: req.user._id
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = {
      text: req.body.comment,
      author: req.user._id
    };
    
    post.comments.push(comment);
    await post.save();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ likes: post.likes.length });
  } catch (error) {
    console.error('Error in likePost:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.json({ likes: post.likes.length });
  } catch (error) {
    console.error('Error in unlikePost:', error);
    res.status(500).json({ message: 'Error unliking post' });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.reactions.push({
      type,
      user: req.user._id
    });
    await post.save();

    res.status(201).json(post.reactions);
  } catch (error) {
    console.error('Error in addReaction:', error);
    res.status(500).json({ message: 'Error adding reaction' });
  }
};
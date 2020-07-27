exports.getPosts = (req, res, next) => {
  // Status is important thing to send since based on it,
  // we can change interface on our client side
  res.status(200).json({
    posts: [{ title: 'First Post', content: 'This is first post!' }],
  });
};

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: { id: Math.random(), title, content },
  });
};

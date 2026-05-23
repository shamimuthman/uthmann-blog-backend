const express = require('express');
const slugify = require('slugify');

const authMiddleware = require('../middleware/auth');
const { createOrUpdateFile } = require('../services/githubService');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      tags = [],
      image = ""
    } = req.body;

    // 🔐 basic validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    const date = new Date().toISOString();

    const safeTags = Array.isArray(tags) ? tags : [];

    const markdown = `---
title: "${title}"
description: "${description || ""}"
pubDate: "${date}"
heroImage: "${image}"
tags: [${(tags || [])
  .map(tag => `"${tag}"`)
  .join(', ')}]
---

${content}
`;

    const filePath = `src/content/blog/${slug}.md`;

    await createOrUpdateFile(
      filePath,
      markdown,
      `Create blog post: ${title}`
    );

    return res.json({
      success: true,
      slug,
      message: "Blog post published successfully"
    });

  } catch (error) {
    console.error(
      error.response?.data || error.message || error
    );

  res.status(500).json({
    success: false,
    message:
      error.response?.data?.message ||
      error.message ||
      'Failed to publish post'
  });
}
});

module.exports = router;
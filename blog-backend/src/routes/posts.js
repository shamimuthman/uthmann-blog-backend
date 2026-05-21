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
      tags,
      image
    } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true
    });

    const date = new Date().toISOString();
    const markdown = `---
title: "${title}"
description: "${description}"
pubDate: "${date}"
heroImage: "${image}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
---

${content}
`;

    const filePath = `src/content/blog/${slug}.md`;

    await createOrUpdateFile(
      filePath,
      markdown,
      `Create blog post: ${title}`
    );

    res.json({
      success: true,
      slug,
      message: 'Blog post published successfully'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to publish post'
    });
  }
});

module.exports = router;
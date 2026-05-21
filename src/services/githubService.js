const axios = require('axios');

const BASE_URL = 'https://api.github.com';

async function createOrUpdateFile(path, content, message) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;
  const token = process.env.GITHUB_TOKEN;

  const url = `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`;

  let sha = null;

  try {
    const existing = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    sha = existing.data.sha;
  } catch (error) {}

  const data = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch
  };

  if (sha) {
    data.sha = sha;
  }

  const response = await axios.put(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  });

  return response.data;
}

module.exports = {
  createOrUpdateFile
};
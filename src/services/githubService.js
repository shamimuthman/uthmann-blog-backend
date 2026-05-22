const axios = require("axios");

const BASE_URL = "https://api.github.com";

async function createOrUpdateFile(path, content, message) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    throw new Error("Missing GitHub environment variables");
  }

  const url = `${BASE_URL}/repos/${owner}/${repo}/contents/${path}`;

  let sha = null;

  try {
    const existing = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
      }
    });

    sha = existing.data.sha;
  } catch (error) {
    // file does not exist OR repo issue
    if (error.response?.status !== 404) {
      console.error("GitHub GET error:", error.response?.data || error.message);
    }
  }

  const data = {
    message,
    content: Buffer.from(content).toString("base64"),
    branch
  };

  if (sha) {
    data.sha = sha;
  }

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("GitHub PUT error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  createOrUpdateFile
};
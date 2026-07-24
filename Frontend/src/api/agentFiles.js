import axios from 'axios';

export const listFiles = async (agentUrl) => {
  const res = await axios.get(`${agentUrl}/list-files`);
  return res.data.files;
};

export const readFile = async (agentUrl, filePath) => {
  const res = await axios.get(`${agentUrl}/read-file?files=${filePath}`);
  return res.data.files[0]; // Returns { path: content }
};

export const updateFile = async (agentUrl, filePath, content) => {
  const res = await axios.patch(`${agentUrl}/update-files`, {
    updates: [{ file: filePath, content }]
  });
  return res.data;
};

export const updateFiles = async (agentUrl, updates) => {
  const res = await axios.patch(`${agentUrl}/update-files`, { updates });
  return res.data;
};
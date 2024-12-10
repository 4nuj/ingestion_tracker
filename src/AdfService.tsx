// src/AdfService.ts
import axios from "axios";

const backendURL = "http://localhost:3001"; // Update this if your backend runs on a different port or host

export const getPipelineStatus = async (): Promise<any> => {
  // Call your backend route that returns pipeline information
  const response = await axios.get(`${backendURL}/api/pipelines`);
  return response.data;
};

export const runPipeline = async (pipelineName: string): Promise<any> => {
  // Call your backend route that triggers the pipeline run
  const response = await axios.post(`${backendURL}/api/runPipeline`, {
    pipelineName,
  });
  return response.data;
};

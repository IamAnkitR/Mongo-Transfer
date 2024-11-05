import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const startTransfer = async (
  sourceUri: string,
  targetUri: string,
  sourceDbName: string,
  targetDbName: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/transfer`, {
      sourceUri,
      targetUri,
      sourceDbName,
      targetDbName,
    });
    return response.data.message;
  } catch (error) {
    throw new Error("Failed to start transfer");
  }
};

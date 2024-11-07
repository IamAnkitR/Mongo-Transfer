import React, { useState } from "react";
import { startTransfer } from "./api";

const MONGO_URI_REGEX =
  /^mongodb(?:\+srv)?:\/\/(?:[^@]+@)?[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})+\/?/;

const App: React.FC = () => {
  const [sourceUri, setSourceUri] = useState<string>("");
  const [targetUri, setTargetUri] = useState<string>("");
  const [sourceDbName, setSourceDbName] = useState<string>("");
  const [targetDbName, setTargetDbName] = useState<string>("");
  const [status, setStatus] = useState<string>("Idle");
  const [loading, setLoading] = useState<boolean>(false);
  const [uriError, setUriError] = useState<string>("");

  const validateUri = (uri: string) => {
    return MONGO_URI_REGEX.test(uri);
  };

  const handleTransfer = async () => {
    if (!validateUri(sourceUri) || !validateUri(targetUri)) {
      setUriError("Please enter valid MongoDB connection URIs.");
      return;
    }

    setUriError("");
    setLoading(true);
    setStatus("Starting transfer...");

    try {
      const message = await startTransfer(
        sourceUri,
        targetUri,
        sourceDbName,
        targetDbName
      );
      setStatus(message);
    } catch (error) {
      setStatus("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
        MongoDB Data Transfer
      </h1>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        <div className="flex flex-col w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Source URI"
            value={sourceUri}
            onChange={(e) => setSourceUri(e.target.value)}
            className="mb-4 px-4 py-2 border rounded w-full"
          />

          <input
            type="text"
            placeholder="Source Database Name"
            value={sourceDbName}
            onChange={(e) => setSourceDbName(e.target.value)}
            className="mb-4 px-4 py-2 border rounded w-full"
          />
        </div>
        <div className="flex flex-col w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Target URI"
            value={targetUri}
            onChange={(e) => setTargetUri(e.target.value)}
            className="mb-4 px-4 py-2 border rounded w-full"
          />

          <input
            type="text"
            placeholder="Target Database Name"
            value={targetDbName}
            onChange={(e) => setTargetDbName(e.target.value)}
            className="mb-6 px-4 py-2 border rounded w-full"
          />
        </div>
      </div>

      {uriError && <p className="text-red-500 mb-4 text-center">{uriError}</p>}

      <p className="mb-6 text-gray-700 text-center">{status}</p>

      <button
        onClick={handleTransfer}
        disabled={loading}
        className={`px-4 py-2 font-semibold text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {loading ? "Transferring..." : "Start Transfer"}
      </button>
    </div>
  );
};

export default App;

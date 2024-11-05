const express = require("express");
const cors = require("cors");
const transferData = require("./transferData");

const app = express();
app.use(
  cors({
    origin: ["https://mongo-transfer-iifj22pl2-iamankitrs-projects.vercel.app"],
  })
);
app.use(express.json());

app.post("/transfer", async (req, res) => {
  const { sourceUri, targetUri, sourceDbName, targetDbName } = req.body;

  if (!sourceUri || !targetUri || !sourceDbName || !targetDbName) {
    return res.status(400).json({
      message:
        "sourceUri, targetUri, sourceDbName, and targetDbName are required",
    });
  }

  try {
    const message = await transferData(
      sourceUri,
      targetUri,
      sourceDbName,
      targetDbName
    );
    res.status(200).json({ message });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Data transfer failed", error: error.message });
  }
});

app.get("/health", async (req, res) => {
  res.send(`Server is up and running`);
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

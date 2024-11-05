const { MongoClient } = require("mongodb");

async function transferData(sourceUri, targetUri, sourceDbName, targetDbName) {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(targetDbName);

    const collections = await sourceDb.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      const cursor = sourceCollection.find();
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        await targetCollection.insertOne(doc);
      }

      console.log(`Collection ${collectionName} transferred.`);
    }

    return "Data transfer completed successfully";
  } catch (error) {
    console.error("Error during transfer:", error);
    throw new Error("Data transfer failed");
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

module.exports = transferData;

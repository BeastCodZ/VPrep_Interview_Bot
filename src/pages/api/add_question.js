import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // MongoDB URI from environment variables
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { category, text } = req.body;

    if (!category || !text) {
      return res.status(400).json({ message: "Category and question text are required." });
    }

    try {
      await client.connect();
      const database = client.db("interviewDB"); // Your database name
      const questionsCollection = database.collection("questions");

      // Insert the new question into the collection
      const result = await questionsCollection.insertOne({
        category,
        text,
        createdAt: new Date(),
      });

      res.status(201).json({ message: "Question added successfully", result });
    } catch (error) {
      console.error("Error inserting question:", error);
      res.status(500).json({ message: "Error inserting question" });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

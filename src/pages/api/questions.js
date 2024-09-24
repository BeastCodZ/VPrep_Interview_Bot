import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // MongoDB URI from environment variables
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { category } = req.query;

  try {
    await client.connect();
    const database = client.db("interviewDB"); // Your DB name
    const questionsCollection = database.collection("questions");

    const questions = await questionsCollection
      .find({ category }) // Fetch questions based on category (HR/Technical)
      .toArray();

    res.status(200).json({ questions: questions.map((q) => q.text) });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  } finally {
    await client.close();
  }
}

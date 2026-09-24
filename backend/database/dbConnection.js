import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL, {
      dbName: "Job_Portal",
    })
    .then(() => {
      console.log("MongoDB Connected Successfully !");
    })
    .catch((error) => {
      console.error(`Failed to connect to MongoDB: ${error}`);
      process.exit(1);
    });
};
export default dbConnection;
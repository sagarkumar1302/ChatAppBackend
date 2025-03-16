// seedUsers.js
import mongoose from "mongoose";
import User from "../models/user.model.js"; // Adjust the path as necessary

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/chap-application", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    // Clear existing users

    // Generate 15 unique users
    const users = [];
    for (let i = 0; i < 15; i++) {
      const user = new User({
        email: `user${i}@example.com`,
        username: `user${i}`,
        fullname: `User Fullname ${i}`,
        password: `password${i}`, // Ensure password meets minlength
        profilepic: "",
      });
      users.push(user);
    }

    // Insert users into the database
    await User.insertMany(users);
    console.log("Database seeded with users!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();
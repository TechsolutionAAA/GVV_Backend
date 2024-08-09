const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Import the cors package
const http = require("http");
const https = require("https");

const app = express();

// Use cors middleware to handle CORS errors
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
      <h1>Welcome to Our Service</h1>
      <p>This is the main endpoint of our backend service. If you're seeing this page, then the server is up and running!</p>
    `);
});

app.get("/api/user/store_email", (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send("Email parameter is required");
  }

  const filePath = path.join(__dirname, "emails.txt");

  // Read the file to check if the email already exists
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error reading file", err);
      return res.status(500).send("Internal Server Error");
    }

    const emailList = data ? data.split("\n").filter(Boolean) : []; // Filter out empty lines

    if (emailList.includes(email)) {
      return res.send("Email already exists");
    }

    // Append the email to the file as it doesn't exist
    fs.appendFile(filePath, `${email}\n`, (err) => {
      if (err) {
        console.error("Error writing to file", err);
        return res.status(500).send("Internal Server Error");
      }

      res.send("Email stored successfully");
    });
  });
});

http.createServer(app).listen(443, () => {
  console.log(`HTTP server running on port ${process.env.PORT}`);
});

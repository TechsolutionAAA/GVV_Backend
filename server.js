const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

// Use cors middleware to handle CORS errors
app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

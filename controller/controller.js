import nodemailer from "nodemailer";

import { db } from "../index.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import session from "express-session";
import crypto from "crypto";
// import crypto from "crypto";
import openai from "openai";
import axios from "axios";

// app.get("/search", async (req, res) => {
//   const apiKey = "AIzaSyBCxspr77oUI8C0pAt13JsTM7Mp5HkirU8"; // Replace with your actual Google API key
//   const customSearchEngineId = "455ac4cb960aa46fd"; // Replace with your custom search engine ID
//   const searchQuery = "car";
//   const languageFilter = "hindi";
//   const cityFilter = "india";
//   try {
//     // Construct the URL for the Google Custom Search API request
//     var apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${customSearchEngineId}&q=${searchQuery}&callback=hndlr`;

//     // You can add additional parameters like language and city to the URL if needed
//     if (languageFilter) {
//       apiUrl += `&lr=${languageFilter}`;
//     }

//     if (cityFilter) {
//       apiUrl += `&location=${cityFilter}`;
//     }

//     // Make the API request
//     const response = await axios.get(apiUrl);

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while making the API request." });
//   }
// });

export const sendMailContact = (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com", // Replace with your own email address
      pass: "qtswjzzghiggvnze", // Replace with your own email password
    },
  });
  // zcgdsscknnjxmjlh
  const mailOptions = {
    from: "amankapil60@gmail.com", // Replace with your own email address
    to: "aman@codelinear.com", // Replace with the recipient's email address
    subject: "New message from your website",
    text: `FristName: ${name}\n Email: ${email}\n phone: ${phone}\nMessage: ${message}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};
export const BookAdemo = (req, res) => {
  const { name, email, phone, company, companysize, role, perpose } = req.body;
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amankapil60@gmail.com", // Replace with your own email address
      pass: "qtswjzzghiggvnze", // Replace with your own email password
    },
  });
  // zcgdsscknnjxmjlh
  const mailOptions = {
    from: "amankapil60@gmail.com", // Replace with your own email address
    to: "aman@codelinear.com", // Replace with the recipient's email address
    subject: "New message from your website",
    text: `FristName: ${name}\n Email: ${email}\n phone: ${phone}\company: ${company} \companysize: ${companysize}\n role: ${role}\n perpose: ${perpose}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
};
export const Register = (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists in the database
  db.query(
    "SELECT * FROM register WHERE email = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert the new user into the database
      db.query(
        "INSERT INTO register (email, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Registration failed" });
          }
          res.status(200).json({ message: "Registration successful" });
        }
      );
    }
  );
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    db.query(
      "SELECT * FROM register WHERE email = ?",
      [username],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Login failed" });
        }

        const user = results[0]; // Assuming the query returns a user

        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ username }, "jsadlkjhfwery39e8udhsl");
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
export const faq = async (req, res) => {
  const { paragraph } = req.body;

  try {
    const generatedFAQs = await generateFAQsUsingOpenAI(paragraph);
    res.json({ faqs: generatedFAQs });
  } catch (error) {
    console.error("Failed to generate FAQs:", error);
    res.status(500).json({ error: "Failed to generate FAQs" });
  }
};
// const { apiKey } = "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";

async function generateFAQsUsingOpenAI(text, apiKey) {
  const prompt = `Create FAQs from the following text:\n\n${text}\n\nQuestions:\n1.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt,
        max_tokens: 50, // Adjust as needed
      },
      {
        // headers: {
        //   // 'Authorization': `Bearer ${apiKey}`,

        //   Authorization: `Bearer ${apiKey}`,
        // },
      }
    );

    const generatedFAQ = response.data.choices[0].text;
    const faqs = generatedFAQ.split("\n").map((faq) => {
      return { question: faq.trim(), answer: "" };
    });

    return faqs;
  } catch (error) {
    throw error;
  }
}

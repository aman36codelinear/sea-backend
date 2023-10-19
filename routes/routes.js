import express from "express";

import {
  //   addWebInfo,
  // updateWebInfo,
  // remove,
  sendMailContact,
  BookAdemo,
  Register,
  Login,
  faq,

  // faqController,
  // generateQuestions,
  // Register
  // Logout,
  //   getweb,
  // Login,
} from "../controller/controller.js";

const router = express.Router();
// router.get("/", getweb);
// router.post("/add", addWebInfo);
// router.post("/login", Login);
router.post("/send_mail", sendMailContact);
router.post("/send_mail_book", BookAdemo);
router.post("/register", Register);
router.post("/login", Login);
router.post("/faq", faq);

// router.post("/generate-faq", (req, res) => {
//   const { paragraph } = req.body;
//   const questions = generateQuestions(paragraph);
//   res.json(questions);
// });
// router.post("/send_mail_career", sendMailCareer);

export default router;

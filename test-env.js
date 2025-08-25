import dotenv from "dotenv"; 
dotenv.config({ path: "./.env" }); 
 
console.log("TEST_KEY:", process.env.TEST_KEY); 
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY); 

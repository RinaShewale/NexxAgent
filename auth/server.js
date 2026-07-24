import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";


connectDB();


const PORT =3000;


app.listen(PORT,()=>{

    console.log(
      `Server running on port ${PORT} 🚀`
    );

});
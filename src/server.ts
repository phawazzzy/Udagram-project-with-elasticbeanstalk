import express from "express";
import bodyParser from "body-parser";
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { auth } from "./middleware/auth.middleware";

const JWT_SECRET = process.env.JWT_SECRET;

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", auth, async (req, res) => {
    try {
      const { image_url } = req.query;
      if (!req.query.image_url) {
        res
          .status(422)
          .send("Please, pass the image_url in the url as query parameter");
      }
      const processImage: string = await filterImageFromURL(image_url);
      if (!processImage) {
        res.status(500).send("Unable to process image");
      }
      res.status(200).sendFile(processImage);
      res.on("finish", () => deleteLocalFiles([processImage]));
    } catch (error) {
      res.status(500).send(error);
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/",  async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  const USERS = [
    {email: 'user1@gmail.com', password: 'user1pass'},
    {email: 'user2@gmail.com', password: 'user2pass'},

  ]
  // login endpoint
  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send('Please, email and password is required')
    }
    const user = USERS.find((doc) => doc.email === email)
    if (!user) {
      return res.status(401).send('Un-authorized')
    }
    if (user.password !== password) {
      return res.status(401).send('incorrect password')
    } 
      // return jwt
      const token = jsonwebtoken.sign(user, JWT_SECRET)
      return res.status(200).send({token})
    
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();

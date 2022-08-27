import express from "express";
import bodyParser from "body-parser";
import { isEmpty } from "lodash";
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "http-errors";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

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

  app.get("/filteredimage", async (req, res) => {
    try {
      if (isEmpty(req.query.image_url)) {
        res
          .status(422)
          .send("Please, pass the image_url in the url as query parameter");
      }
      const processImage = await filterImageFromURL(req.query.image_url);
      console.log(processImage);
      if (!processImage) {
        res.status(422).send("Unable to process image");
      }
      res.status(200).json({
        status: true,
        message: `Your processed image is ready for download`,
        data: { processImage },
      });
      res.on("finish", ()=> deleteLocalFiles([processImage]))
    } catch (error: any) {
      res.status(422).send();
    }
  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
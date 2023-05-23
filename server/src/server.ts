import app from "./app";

const port = process.env.PORT || 1024;

let server: () => void = () => {
  try {
    if (require.main === module)
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
      });
  } catch (error) {
    console.error(error);
  }
};

server();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { validateInputPart } = require("./handlers/validateInput");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function createJwtToken(user, secretKey, exp_period) {
  let signedErr;
  let signedToken;

  await jwt.sign(
    { user: user },
    secretKey,
    { expiresIn: exp_period },
    (err, token) => {
      if (err) {
        console.log(err);
        signedErr = err;
      }
      console.log({ token });
      signedToken = token;
    }
  );

  if (signedErr) {
    return signedErr; // will be an Error object (thus typeof signedErr === "object")
  }
  return signedToken; // will be a string (thus typeof signedToken === "string")
}

let parts = [
  { id: 1, name: "joint1", clientID: "a1" },
  { id: 2, name: "joint2", clientID: "a2" },
  { id: 3, name: "joint3", clientID: "a3" }
];

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the homepage!" });
});

app.get("/api/parts", (req, res) => {
  res.json(parts);
});

app.get("/api/parts/:id", (req, res) => {
  //check data existence
  const foundPart = parts.find(part => {
    return part.id === parseInt(req.params.id);
  });
  if (typeof foundPart === "undefined") {
    return res.status(404).json({ message: "Error: content not found!" });
  }
  res.send(foundPart);
});

app.post("/api/login", async (req, res) => {
  //mock user validation completion
  const user = {
    id: 1000,
    username: "Yifan",
    email: "a@qq.com"
  };
  const secretKey = "my_secret_key";
  //const secretKey = false;
  const expiration_period = "1d";

  let jwtResult = await createJwtToken(user, secretKey, expiration_period);
  //console.log(typeof jwtResult);
  if (typeof jwtResult !== "string")
    //meaning jwtResult is returned as an Error object!
    return res.json({ Error: "failed to send back signed jwt token" });
  res.json({ token: jwtResult });
});

app.post("/api/parts", (req, res) => {
  //validate posted data
  let error = validateInputPart(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //update db with the posted data
  const part = {
    id: parseInt(req.body.id),
    name: req.body.name,
    clientID: req.body.clientID
  };
  parts.push(part);
  //res.json the posted data
  res.json(part);
});

app.put("/api/parts/:id", (req, res) => {
  //check data existence
  let foundPart = parts.find(part => {
    return part.id === parseInt(req.params.id);
  });
  if (typeof foundPart === "undefined") {
    return res.status(404).json({ message: "Error: content not found!" });
  }
  //validate posted data
  let error = validateInputPart(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //finally update the found data
  let foundDataIndex = parts.indexOf(foundPart);
  parts[foundDataIndex] = {
    id: parseInt(req.body.id),
    name: req.body.name,
    clientID: req.body.clientID
  };
  //res.json the updated data
  //console.log(parts[foundDataIndex]);
  res.json(parts[foundDataIndex]);
});

app.delete("/api/parts/:id", (req, res) => {
  //check data existence
  let foundPart = parts.find(part => {
    return part.id === parseInt(req.params.id);
  });
  if (typeof foundPart === "undefined") {
    return res.status(404).json({ message: "Error: content not found!" });
  }
  //delete the data
  let foundDataIndex = parts.indexOf(foundPart);
  parts.splice(foundDataIndex, 1);
  //res.json the remaining data
  res.json(parts);
});

app.listen(port, () => {
  console.log(`server is listening on port: ${port}`);
});

const jwt = require("jsonwebtoken");

exports.createJwtToken = async function(user, secretKey, exp_period) {
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
};
// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
exports.extractJwtToken = function(req, res, next) {
  const headerAuthString = req.headers["authorization"];
  if (typeof headerAuthString === "undefined") {
    return res
      .status(403)
      .json({ message: "Error! No auth token in the header!" });
  }
  const authToken = headerAuthString.split(" ")[1];
  console.log(authToken);
  req.token = authToken;
  next();
};

exports.verifyJwtToken = async function(token, secretKey) {
  let authError;
  let authResultData;
  await jwt.verify(token, secretKey, (err, authResult) => {
    if (err) {
      console.log(err);
      authError = err;
    }
    console.log(authResult);
    authResultData = authResult;
  });
  if (authError) {
    return authError; // the error will be an Error object with a key of 'message'
  }
  return authResultData;
};

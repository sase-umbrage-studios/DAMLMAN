// Source: https://www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs

const crypto = require("crypto");

const toBase64 = obj => {
  const str = JSON.stringify (obj);
  return Buffer.from(str).toString ('base64');
};

const replaceSpecialChars = b64string => {
  return b64string.replace (/[=+/]/g, charToBeReplaced => {
    switch (charToBeReplaced) {
      case '=':
        return '';
      case '+':
        return '-';
      case '/':
        return '_';
    }
  });
};

const createSignature =(jwtB64Header,jwtB64Payload,secret)=>{
  let signature = crypto.createHmac ('sha256', secret);
  signature.update (jwtB64Header + '.' + jwtB64Payload);
  signature = signature.digest ('base64');
  signature = replaceSpecialChars (signature);
  return signature
};

const header = {
  alg: 'HS256',
  typ: 'JWT',
};

module.exports = (arrayOfStringifiedParties) => {
  const payload = {
    "https://daml.com/ledger-api": {
      ledgerId: "sandbox",
      applicationId: "HTTP-JSON-API-Gateway",
      actAs: arrayOfStringifiedParties
    }
  };

  const b64Header = toBase64 (header);
  const jwtB64Header = replaceSpecialChars(b64Header);
  const b64Payload = toBase64(payload);
  const jwtB64Payload = replaceSpecialChars(b64Payload);
  const secret = "";
  const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
  const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature;

  return jsonWebToken;
};
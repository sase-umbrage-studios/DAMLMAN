const axios = require("axios");
const DAML_HOST = process.env.DAML_HOST;
const TICK_RATE = 1000;

module.exports = (DATA) => {
  setInterval(() => {
    axios({
      method: "get",
      url: `${DAML_HOST}/v1/query`,
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${DATA.fullAccessAuth}`
      }
    })
    .then(({data}) => DATA.activeContracts = data.result)
    .catch(() => {});
  }, TICK_RATE);
};
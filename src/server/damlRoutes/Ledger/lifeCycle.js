const axios = require('axios');
const DAML_HOST = process.env.DAML_HOST;

module.exports = (req, res, DATA) => {
  axios({
    method: "post",
    url: `${DAML_HOST}/v1/exercise`,
    maxBodyLength: Infinity,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${DATA.fullAccessAuth}`
    },
    data: JSON.stringify({
      "templateId": DATA.templateId,
      "contractId": DATA.policyStateTrackerId,
      "choice": "LifeCycle",
      "argument": {
        "scheduledLifecycleTime": "2023-06-09T15:12:30.692363Z"
      }
    })
  })
  .then(({data}) => {
    DATA.exercisedButtons.push("LifeCycle");
    res.end(JSON.stringify(data));
  })
  .catch(err => console.log("New Loan Error: ", {err}));
};
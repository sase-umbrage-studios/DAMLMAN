const axios = require("axios");
const toJWT = require("../../utils/toJWT.js");

const INITIAL_GET_PARTIES_AUTH = process.env.INITIAL_GET_PARTIES_AUTH;
const DAML_HOST = process.env.DAML_HOST;

const getPolicyStateTracker = (DATA) => {
  return axios({
    method: "post",
    url: `${DAML_HOST}/v1/fetch`,
    maxBodyLength: Infinity,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${DATA.fullAccessAuth}`
    },
    data: JSON.stringify({
      "templateId": DATA.templateId,
      "key": {
        "_1": DATA.carrier,
        "_2": DATA.policyNumber
      }
    })
  });
};

module.exports = async (req, res, DATA) => {
  try {
    axios.defaults.headers.common = {'Authorization': `Bearer ${INITIAL_GET_PARTIES_AUTH}`};

    const { data } = await axios.get(`${DAML_HOST}/v1/parties`);
    let allParties = [];
    data.result.forEach(p => {
      allParties.push(p.identifier);
      if (p.displayName === "Everly") DATA.carrier = p.identifier;
      else if (p.displayName === "PlatformAdmin") DATA.platformAdmin = p.identifier;
    });

    DATA.fullAccessAuth = toJWT(allParties);

    getPolicyStateTracker(DATA)
    .then(({data}) => {
      DATA.policyStateTrackerId = data.result.contractId;
      DATA.exercisedButtons.push("Init");

      if (!DATA.settingPolicyStateTrackerOnInterval) {
        setInterval(() => {
          getPolicyStateTracker(DATA)
          .then(({data}) => DATA.policyStateTrackerId = data.result.contractId)
          .catch(() => {});
        }, 1500);
      }

      DATA.settingPolicyStateTrackerOnInterval = true;
      res.end(data.result.contractId);
    })
    .catch(err => console.error("PolicyStateTracker Error: ", err));

  } catch (err) {
    res.status(500).end(JSON.stringify(err));
  }
};
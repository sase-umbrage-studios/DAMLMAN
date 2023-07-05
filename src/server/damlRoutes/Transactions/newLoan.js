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
      "choice": "NonTransferAdHocPolicyChange",
      "argument": {
        "request": {
          "tag": "NewLoanRequest",
          "value": {
            "newLoanRequestAmount": 25,
            "amountType": "Amount",
            "disbursementType": "Gross",
            "loanType": "Preferred",
            "loanInterestType": "Indexed",
            "taxWithholdingInstructions": [],
            "payees": [
              {
                "partyPolicyID": "Party_PI_1",
                "percentage": 2,
                "bankID": "bankID"
              }
            ],
            "effectiveDate": "1970-01-01",
            "requestor": DATA.platformAdmin
          }
         }
      }
    })
  })
  .then(({data}) => {
    if (data.status === 200) DATA.policyStateTrackerId = data.result.exerciseResult.status.value.policyStateTrackerId;
    DATA.exercisedButtons.push("New Loan");
    res.end(JSON.stringify(data));
  })
  .catch(err => console.log("New Loan Error: ", {err}));
};
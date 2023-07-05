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
          "tag": "SystematicLoanRepaymentSetupRequest",
          "value": {
            "loanRepaymentType": "PrincipalFirst",
            "paymentForm": "EFT",
            "frequency": "OnlyOnce",
            "requestDate": "2023-06-20",
            "startDate": "2023-06-08",
            "schedule": {
              "previousDate": null,
              "nextDate": null,
              "amountType": "Amount",
              "amount": 10
            },
            "payors": {
              "hd": {
                "partyPolicyID": "Party_PI_1",
                "percentage": 100,
                "bankID": "TODO Bank Id"
              },
              "tl": []
            },
            "effectiveDate": "2023-06-08"
          }
        }
      }
    })
  })
  .then(({data}) => {
    if (data.status === 200) DATA.policyStateTrackerId = data.result.exerciseResult.status.value.policyStateTrackerId;
    DATA.exercisedButtons.push("Systematic Loan Repayment");
    res.end(JSON.stringify(data));
  })
  .catch(err => console.log("Systematic Loan Repayment: ", {err}));
};
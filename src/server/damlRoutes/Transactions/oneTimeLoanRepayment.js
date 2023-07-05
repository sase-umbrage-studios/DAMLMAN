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
          "tag": "PaymentLoanRepaymentOneTimeRequest",
          "value": {
            "loanRepaymentPaymentAmount": 100,
            "loanRepaymentType": "InterestFirst",
            "allocationOption": "Dollar",
            "requestDate": "2023-06-26",
            "startDate": "2023-06-26",
            "payors": {
              "hd": {
                "partyPolicyID": "Party_PI_1",
                "percentage": 100,
                "bankID": "TODO Bank Id"
              },
              "tl": []
            },
            "effectiveDate": "2023-06-26"
          }
        }
      }
    })
  })
  .then(({data}) => {
    if (data.status === 200) DATA.policyStateTrackerId = data.result.exerciseResult.status.value.policyStateTrackerId;
    DATA.exercisedButtons.push("One Time Loan Repayment");
    res.end(JSON.stringify(data));
  })
  .catch(err => console.log("One Time Loan Repayment: ", {err}));
};
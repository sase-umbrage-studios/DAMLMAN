const { exec } = require("child_process");
const SOR_DAML_PATH = process.env.SOR_DAML_PATH_FROM_ROOT;

const cmd = `cd ${SOR_DAML_PATH} && daml damlc inspect-dar --json .packages/models/.daml/dist/sor-mvp-models-0.0.1.dar | jq .main_package_id`;

module.exports = (DATA) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) throw new Error(error);
    DATA.templateId = [stdout, ":PolicyStateTracker.PolicyStateTracker:PolicyStateTracker"].join("").replaceAll("\n", "").replaceAll("\"", "");
    DATA.templateIdWasSet();
  });
};
const { exec } = require("child_process");
const buildFirst = process.env.BUILD_BEFORE_SETUP === "true";
const zsorPath = process.env.ZSOR_DEPLOYMENT_PATH_FROM_ROOT;
const sorPath = process.env.SOR_DAML_PATH_FROM_ROOT;

const timeInMs = () => new Date().getTime();
const deltaTimeMin = (newTime, oldTime) => `${((newTime - oldTime) / 60000).toFixed(2)} Minutes`;
const onError = (ctx, error, child_process, res) => {
  child_process.kill();
  console.error(`Error running ${ctx}, error: ${error}`);
  res.status(500).end(`Error running ${ctx}, error: ${error}`);
};

module.exports = (req, res, DATA) => {
  const initialStartTime = timeInMs();

  console.log("Running 'make clean end2end'");
  const childProcess1 = exec(`cd ${sorPath} && ${buildFirst? "make clean end2end" : "ls"}`, (error) => {
    if (error) return onError("make clean end2end", error, childProcess1, res);
    childProcess1.kill();
    process.on("exit", () => childProcess1.kill());
    let timeOfCP1Complete = timeInMs();
    console.log(`Completed 'make clean end2end', took ${deltaTimeMin(timeOfCP1Complete, initialStartTime)}`);

    console.log("Running `scripts/local_start.sh`");
    const childProcess2 = exec(`cd ${sorPath} && scripts/local_start.sh`);
    process.on("exit", () => childProcess2.kill());
    childProcess2.on("error", (error) => onError("scripts/local_start.sh", error, childProcess2, res));
    childProcess2.stdout.on("data", text => {

      if (JSON.stringify(text).indexOf("200") !== -1) {
        childProcess2.kill();
        let timeOfCP2Complete = timeInMs();
        console.log(`Completed 'scripts/local_start.sh', took ${deltaTimeMin(timeOfCP2Complete, timeOfCP1Complete)}`);

        console.log("Running 'docker compose down'");
        const childProcess3 = exec(`cd ${zsorPath} && docker compose down`, (error) => {
          childProcess3.kill();
          if (error) return onError("docker compose down", error, childProcess3, res);
          process.on("exit", () => childProcess3.kill());
          const timeOfCP3Complete = timeInMs();
          console.log(`Completed 'docker compose down', took ${deltaTimeMin(timeOfCP3Complete, timeOfCP2Complete)}`);

          console.log("Running './run_zsor sandbox'");
          const childProcess4 = exec(`cd ${zsorPath} && ./run_zsor sandbox`, (error) => {
            childProcess4.kill();
            if (error) return onError("./run_zsor sandbox", error, childProcess4, res);
            process.on("exit", () => childProcess4.kill());
            const timeOfCP4Complete = timeInMs();
            console.log(`Completed './run_zsor sandbox', took ${deltaTimeMin(timeOfCP4Complete, timeOfCP3Complete)}`);
            
            console.log(`Completed end2end (running), took ${deltaTimeMin(timeInMs(), initialStartTime)}`);
            DATA.exercisedButtons.push("End2End");
            res.end(`Completed end2end, took ${deltaTimeMin(timeInMs(), initialStartTime)}`);
          });
        });
      }
    });
  });
};
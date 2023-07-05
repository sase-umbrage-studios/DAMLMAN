require("dotenv").config();
const express = require("express");
const path = require("path");
const DATA = require("./utils/Data.js");
const setTemplateId = require("./utils/setTemplateId.js");
const getAllActiveContracts = require("./utils/getAllActiveContracts.js");
const routes = require("./damlRoutes/route.js");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Init
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;
const _public = path.join(__dirname, "..", "..", "public");
const html = path.join(__dirname, "..", "..", "public", "index.html");
const SOCKET_TICK_RATE = 500;

// Globals && Mutable
DATA.templateId = null;
DATA.fullAccessAuth =null;
DATA.policyStateTrackerId = null;
DATA.platformAdmin = null;
DATA.carrier = null;
DATA.policyNumber = process.env.POLICY_NUMBER || "AU81336138";
DATA.activeContracts = [];
DATA.exercisedButtons = [];

// Socket
io.on("connection", socket => {
  console.log("Socket connection secured");
  setInterval(() => {
    socket.emit("DATA", { policyStateTrackerId, platformAdmin, carrier, activeContracts, exercisedButtons } = DATA);
  }, SOCKET_TICK_RATE);
});

// Route Map for React Buttons
const buttonRouteMap = {
  // Category: [[Button Name, Route URL]]
  "Setup (Prerequisite)" : [["End2End", "/end2end"],
                            ["Init", "/parties"],
                            ["LifeCycle", "/lifeCycle"]],

  "Transactions"         : [//["New Loan", "/newLoan"],
                            //["One Time Loan Repayment", "/oneTimeLoanRepayment"],
                            //["Systematic Loan Repayment", "/systematicLoanRepayment"]]
                            ["Full Surrender", "/fullSurrender"]]
};

// Init
setTemplateId(DATA);
getAllActiveContracts(DATA);

// Middlewares
app.use(express.json());
app.use(express.static(_public));

// Routes
app.get("/", (req, res) => res.sendFile(html));
// setup
app.get("/end2end", (req, res) => routes.end2end(req, res, DATA));
app.get("/parties", (req, res) => routes.getParties(req, res, DATA));
app.get("/lifeCycle", (req, res) => routes.lifeCycle(req, res, DATA));
app.get("/routes", (req, res) => res.end(JSON.stringify(buttonRouteMap)));
// transactions 
app.get("/fullSurrender", (req, res) => routes.fullSurrender(req, res, DATA));
app.get("/newLoan", (req, res) => routes.newLoan(req, res, DATA));
app.get("/oneTimeLoanRepayment", (req, res) => routes.oneTimeLoanRepayment(req, res, DATA));
app.get("/systematicLoanRepayment", (req, res) => routes.systematicLoanRepayment(req, res, DATA));

// Listener
server.listen(port, () => console.log(`localhost:${port}`));
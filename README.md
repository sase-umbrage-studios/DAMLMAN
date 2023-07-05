[STEPS]

1. run `npm install`
2. setup .env file
    
    PORT                           - Specify any available port for the server to run on
    SOR_DAML_PATH_FROM_ROOT        - Path of SOR-DAML directory relative to DAMLMAN's root folder
    ZSOR_DEPLOYMENT_PATH_FROM_ROOT - Path of zsor-deployment directory relative to DAMLMAN's root folder
    INITIAL_GET_PARTIES_AUTH       - Auth token to fetch parties (check Postman variables `GetAllParties - Authorization`)
    DAML_HOST                      - URL of where DAML is hosted (local/ hub)
    POLICY_NUMBER                  - Policy number of current XML (required to get PolicyStateTracker)
    BUILD_BEFORE_SETUP             - Where or not it should run `make clean end2end` with `End2End` button

    Example: (If DAMLMAN directory was in the same root directory as SOR-DAML and zsor-deployment)
        DAML_HOST                      - "http://localhost:7575"
        ZSOR_DEPLOYMENT_PATH_FROM_ROOT - "../zsor-deployment"
        SOR_DAML_PATH_FROM_ROOT        - "../SOR-DAML"
        POLICY_NUMBER                  - "AU81336138"
        PORT                           = "8080"
        BUILD_BEFORE_SETUP             = "true"
        INITIAL_GET_PARTIES_AUTH       - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    eyJodHRwczovL2RhbWwuY29tL2xlZGdlci1hcGkiOnsibGVkZ2VySWQiOiJzYW5kYm94IiwiYXBwbGljYXRpb25JZCI6IkhUVFAtSlNPTi1BUEktR2F0ZXdheSIsImFjdEFzIjpbIjU4MzAyNTEyN2dmU0sxOTc4LTA5LTI0OjoxMjIwYjg4OTM3NGMzYzhkZDYxMzBiNGNjZDMxNWY5ODY2YmRiZDIyNDc3ZDU5ZDU0Y2RkM2NiNWFhOGQyY2VjNDA3NCIsInBsYXRmb3JtQWRtaW46OjEyMjBiODg5Mzc0YzNjOGRkNjEzMGI0Y2NkMzE1Zjk4NjZiZGJkMjI0NzdkNTlkNTRjZGQzY2I1YWE4ZDJjZWM0MDc0IiwiZXZlcmx5OjoxMjIwYjg4OTM3NGMzYzhkZDYxMzBiNGNjZDMxNWY5ODY2YmRiZDIyNDc3ZDU5ZDU0Y2RkM2NiNWFhOGQyY2VjNDA3NCJdfX0.KTy2mv6cPYSZ8aiLf6zmXzHhKI-VGeyIh1x8QH-XcU0"

3. run `npm start`
     * This builds webpack and runs the server with node. Everytime the server has been updated, you will have to re-run `npm start`. If  you're actively developing on the app, open a terminal and run `npm run build`, then open another terminal window and run `npm start-dev`. This makes webpack look at your Front-End updates and update the changes, and it makes the backend use `nodemon` instead of node, meaning every backend change will update and restart the server.

4. If End2End is up and running you do not need to run it within the node server, don't click on the `End2End` button. If it's not up,
   then click the `End2End` button. 

   * When it lights green, it means it successfully ran `make clean end2end`, `scripts/local_start.sh`, and `./run_zsor sandbox`. WAIT for policy to process (xml needs to be processed to create the policyStateTracker) before continuing

5. After the xml has been processed, a PolicyStateTracker would've been made... Then click the `Init` button. This will tell the server 
   to set the policyStateTrackerCid, platformAdmin, carrier, ... variables to be used in transactions

   * You will know everything is working well if the top right boxes have been populated (Platform Admin, Carrier, PolicyStateTracker), this should also load the active contracts on the bottom right of the page.

6. Run any transactions you've added. You probably do want to run the LifeCycle transaction first though.


[NOTE]
  GREEN DOES NOT MEAN DONE... When the button turns green on the UI, it just means the server is done with the request... DAML and other services will still be processing these requests... 


[HOW TO ADD A TRANSACTION]
  1. Navigate to `/src/server/index.js`
  2. Locate variable `buttonRouteMap`
  3. Create a new category by adding a key to the object, or add a button under a category by adding a tuple to the buttonList of a 
     category. For the tuple, the first element is the buttonName and the second element is the get request url when the button is clicked
  4. Create a get request for the button on the node server
  5. Go to `/src/server/damlRoutes/route.js` and add a new route for the transaction/ button...
  6. Your route should link to a request controller that makes an axios request to the DAML ledger JSON api
  7. To verify your actions went through, after your request completed... add it to the exercisedButtons list...
     DATA.exercisedButtons.push("< ExactNameOfButton >"); This is when the button will turn green on the frontend
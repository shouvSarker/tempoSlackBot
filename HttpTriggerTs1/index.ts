import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  // Get existing jira configurations.
  // Depending on how jira is set up, payPeriod and
  // hours per pay period may be extracted
  //   const jiraConfiguration = await axios.get(
  //     "http://localhost:2990/jira/rest/api/2/configuration",
  //     {
  //       auth: {
  //         username: "admin",
  //         password: "admin",
  //       },
  //     }
  //   );

  // The number of days in the pay period/checking period
  const payPeriodDays: number = 14;

  // Use for pay period hours checking
  const hoursPerPayPeriod: number = 76;

  // Use current as fromDate for 1 day checkup
  const fromDate = new Date().setDate(Date.now() - payPeriodDays);

  const currentDate: string = new Date().toISOString().slice(0, 10);

  //   const hoursPerDay: number = Number(
  //     jiraConfiguration.data["timeTrackingConfiguration"]["workingHoursPerDay"]
  //   );

  const queryData = { from: fromDate, to: currentDate, worker: ["admin"] };

  //   const jiraWorklogs = await axios.post(
  //     "http://localhost:2990/jira/rest/tempo-timesheets/4/worklogs/search",
  //     queryData,
  //     {
  //       auth: {
  //         username: "admin",
  //         password: "admin",
  //       },
  //     }
  //   );

  //   const jiraConfiguration = await axios.get(
  //     "http://localhost:2990/jira/rest/api/2/configuration",
  //     {
  //       auth: {
  //         username: "admin",
  //         password: "admin",
  //       },
  //     }
  //   );

  //   const currentDate = new Date().toISOString().slice(0, 10);

  //   const hoursPerDay =
  //     jiraConfiguration.data["timeTrackingConfiguration"]["workingHoursPerDay"];
  //   const queryData = { from: currentDate, to: currentDate, worker: ["admin"] };

  //   const jiraWorklogs = await axios.post(
  //     "http://localhost:2990/jira/rest/tempo-timesheets/4/worklogs/search",
  //     queryData,
  //     {
  //       auth: {
  //         username: "admin",
  //         password: "admin",
  //       },
  //     }
  //   );

  //   const times = jiraWorklogs.data.reduce(function (total, entry) {
  //     return total + entry["timeSpent"].upper().split(" ")[0];
  //   }, 0);

  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? "Hello, " +
      name +
      //+hoursPerDay +
      //" " +
      // times +
      ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;

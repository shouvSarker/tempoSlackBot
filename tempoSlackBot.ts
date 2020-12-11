import axios from "axios";
//import * as a from "./";

const test = async function test() {
  // Get existing jira configurations.
  // Depending on how jira is set up, payPeriod and
  // hours per pay period may be extracted
  const jiraConfiguration = await axios.get(
    "http://localhost:2990/jira/rest/api/2/configuration",
    {
      auth: {
        username: "admin",
        password: "admin",
      },
    }
  );

  // The number of days in the pay period/checking period
  const payPeriodDays: number = 14;

  // Use for pay period hours checking
  const hoursPerPayPeriod: number = 76;

  // Use current as fromDate for 1 day checkup
  const fromDate = new Date().setDate(Date.now() - payPeriodDays);

  const currentDate: string = new Date().toISOString().slice(0, 10);

  const hoursPerDay: number = Number(
    jiraConfiguration.data["timeTrackingConfiguration"]["workingHoursPerDay"]
  );

  const queryData = { from: fromDate, to: currentDate, worker: ["admin"] };

  const jiraWorklogs = await axios.post(
    "http://localhost:2990/jira/rest/tempo-timesheets/4/worklogs/search",
    queryData,
    {
      auth: {
        username: "admin",
        password: "admin",
      },
    }
  );

  const extractHours = (element): number => {
    const eachElement = element.split("");
    switch (eachElement[1]) {
      case "D":
        return Number(eachElement[0]) * hoursPerDay;
      case "H":
        return Number(eachElement[0]);
      case "M":
        return Number(eachElement[0]) / 60;
      case "S":
        return Number(eachElement[0]) / 3600;
    }
  };

  const getHours = (worklog): number => {
    return worklog.reduce(function (total, element) {
      return total + extractHours(element);
    }, 0);
  };

  const times: number = jiraWorklogs.data.reduce(function (total, entry) {
    const time = entry["timeSpent"].toUpperCase().split(" ");
    return total + getHours(time);
  }, 0);

  const reminderMessage = {
    quote:
      "You haven't logged all your time. The amount of time spent is: " + times,
  };

  const postOnSlack = await axios.post(
    "https://hooks.slack.com/workflows/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",
    times < hoursPerPayPeriod ? reminderMessage : "You are all good with time!"
  );

  console.log(times);
};

test();

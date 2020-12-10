import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime, timedelta

# Calculates the total time from a Jira worklog fetch response
def calculateTotalTime(response):
    jiraConfigurationJson = requests.get('http://ba5408a74fbb.ngrok.io/jira/rest/api/2/configuration',
    auth=HTTPBasicAuth('admin', 'admin'))
    hoursPerDay = float(jiraConfigurationJson.json()['timeTrackingConfiguration']['workingHoursPerDay'])

    timeSpent = 0.0
    for worklog in responseJira.json():
        timeSpentText = worklog['timeSpent']
        timeSpentText = timeSpentText.upper()
        timeSplits = timeSpentText.split(" ")
        for timeSplit in timeSplits:
            if "D" in timeSplit:
                timeSpent += float(timeSplit.split('D')[0])*hoursPerDay
            elif "H" in timeSplit:
                timeSpent += float(timeSplit.split('H')[0])
            elif "M" in timeSplit:
                timeSpent += float(timeSplit.split('M')[0])/60 
            elif "S" in timeSplit:
                timeSpent += float(timeSplit.split('S')[0])/60/60
    return timeSpent

#Variables to modify
numberOfDays = 1 #Specifies the number of days to search back for worklogs
workLimit = 7.0  #Specifies the lower limit on the number of hours worked over the period before a message is sent

today = datetime.today()
currentDate = today.strftime("%Y-%m-%d")
startDate = (today - timedelta(days=numberOfDays)).strftime("%Y-%m-%d")

# Create a new resource
responseJira = requests.post('http://ba5408a74fbb.ngrok.io/jira/rest/tempo-timesheets/4/worklogs/search',
    json = {'from': startDate, 'to': currentDate, 	"worker": ["admin"]},
    auth=HTTPBasicAuth('admin', 'admin'))

timeSpent = calculateTotalTime(responseJira)

if timeSpent < workLimit :
    response = requests.post('https://hooks.slack.com/workflows/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',
    json = {'quote':'Remember to log your hours in Jira. You only have '+ "{:.2f}".format(timeSpent) + " Hours logged for today!"})

# print(response)
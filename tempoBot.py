import requests
from requests.auth import HTTPBasicAuth

# Create a new resource
responseJira = requests.post('http://localhost:2990/jira/rest/tempo-timesheets/4/worklogs/search',
    json = {'from': '2020-12-01', 'to': '2020-12-31', 	"worker": ["admin"]},
    auth=HTTPBasicAuth('admin', 'admin'))

timeSpent = responseJira.json()[0]['timeSpent']


response = requests.post('https://hooks.slack.com/workflows/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',
 json = {'quote':'The time spent is: '+timeSpent})

print(response)
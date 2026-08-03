# VibeCampus Make Automation Scenario

This scenario receives a VibeCampus report, logs it to Google Sheets, creates follow-up tasks, and sends a group recap or organizer alert depending on the routing decision.

## Scenario Goal

Turn a generated VibeCampus report into an automated operations trail:

```text
VibeCampus dashboard
-> Make custom webhook
-> Parse JSON
-> Google Sheets: log session
-> Iterator: create task rows
-> Router
   -> human review needed: log/send organizer alert
   -> no review needed: send group recap
-> Webhook response
```

## Module 1: Custom Webhook

App:

```text
Webhooks
```

Action:

```text
Custom webhook
```

Name:

```text
VibeCampus Report Intake
```

After creating the webhook, copy the webhook URL into the VibeCampus **Optional automation webhook** field.

## Module 2: Parse JSON

App:

```text
JSON
```

Action:

```text
Parse JSON
```

JSON string:

```text
Body
```

If Make already detects the body fields from the webhook, this module is optional. Keep it if Make shows the payload as raw text.

## Module 3: Google Sheets - Add Session Row

App:

```text
Google Sheets
```

Action:

```text
Add a Row
```

Sheet:

```text
VibeCampus Automation Logs
Tab: Sessions
```

Map these values:

```text
log_id -> automation_outputs.google_sheets_row.log_id
created_at -> automation_outputs.google_sheets_row.created_at
session_code -> session.code
session_title -> session.title
mode -> mode
question -> session.question
response_count -> session.response_count
winning_option -> ai_analysis.winning_option
vibe_score -> ai_analysis.vibe_score
drama_meter -> ai_analysis.drama_meter
priority -> routing.priority
needs_human_review -> routing.needs_human_review
suggested_channel -> routing.suggested_channel
share_summary -> share_summary
```

## Module 4: Iterator - Tasks

App:

```text
Tools
```

Action:

```text
Iterator
```

Array:

```text
automation_outputs.task_queue
```

## Module 5: Google Sheets - Add Task Row

App:

```text
Google Sheets
```

Action:

```text
Add a Row
```

Sheet:

```text
VibeCampus Automation Logs
Tab: Tasks
```

Map:

```text
task_id -> task_id
created_at -> payload.created_at
session_code -> payload.session.code
title -> title
details -> details
owner -> owner
priority -> priority
due_hint -> due_hint
status -> status
```

## Module 6: Router

Create two routes.

### Route A: Organizer Review Needed

Filter:

```text
routing.needs_human_review equals true
```

Actions:

```text
Google Sheets -> Add a Row -> Alerts
Telegram/Slack/Email -> Send organizer alert
```

Alert message:

```text
{{automation_outputs.organizer_alert.message}}
```

### Route B: Safe Group Recap

Filter:

```text
routing.needs_human_review equals false
```

Actions:

```text
Telegram/Slack/Email -> Send group recap
```

Message:

```text
{{automation_outputs.group_recap.message}}
```

## Module 7: Webhook Response

App:

```text
Webhooks
```

Action:

```text
Webhook response
```

Status:

```text
200
```

Body:

```json
{
  "ok": true,
  "message": "VibeCampus automation completed",
  "session_code": "{{session.code}}",
  "priority": "{{routing.priority}}",
  "needs_human_review": "{{routing.needs_human_review}}"
}
```

## Demo Path Without Credentials

If Google Sheets or Telegram is not connected, you can still demonstrate:

1. Generate a vibe report.
2. Open the Automation section.
3. Show the structured JSON payload.
4. Click **Copy payload**.
5. Explain that Make receives this payload through a webhook and maps it to the sheet/task/alert modules above.


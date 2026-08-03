# VibeCampus n8n Automation Design

This is the n8n version of the VibeCampus automation. It receives the same payload as the Make scenario.

## Workflow

```text
Webhook Trigger
-> Normalize Payload
-> Add Session Row
-> Split Out Tasks
-> Add Task Row
-> Review Check
   -> true: Add Alert Row + Send Organizer Alert
   -> false: Send Group Recap
-> Respond to Webhook
```

## Node 1: Webhook Trigger

Node:

```text
Webhook
```

Method:

```text
POST
```

Path:

```text
vibecampus-report
```

Response mode:

```text
Using Respond to Webhook node
```

Copy the test or production webhook URL into VibeCampus.

## Node 2: Normalize Payload

Node:

```text
Code
```

JavaScript:

```js
const payload = $input.first().json.body || $input.first().json;

return [
  {
    json: {
      ...payload,
      session_code: payload.session?.code,
      session_title: payload.session?.title,
      priority: payload.routing?.priority,
      needs_human_review: payload.routing?.needs_human_review,
      sheet_row: payload.automation_outputs?.google_sheets_row,
      tasks: payload.automation_outputs?.task_queue || [],
      organizer_alert: payload.automation_outputs?.organizer_alert,
      group_recap: payload.automation_outputs?.group_recap
    }
  }
];
```

## Node 3: Add Session Row

Node:

```text
Google Sheets
```

Operation:

```text
Append row
```

Sheet:

```text
Sessions
```

Map from:

```text
{{$json.sheet_row.log_id}}
{{$json.sheet_row.created_at}}
{{$json.session_code}}
{{$json.session_title}}
{{$json.mode}}
{{$json.session.question}}
{{$json.session.response_count}}
{{$json.ai_analysis.winning_option}}
{{$json.ai_analysis.vibe_score}}
{{$json.ai_analysis.drama_meter}}
{{$json.priority}}
{{$json.needs_human_review}}
{{$json.routing.suggested_channel}}
{{$json.share_summary}}
```

## Node 4: Split Out Tasks

Node:

```text
Split Out
```

Field to split out:

```text
tasks
```

Then append each task to the `Tasks` sheet.

## Node 5: Review Check

Node:

```text
If
```

Condition:

```text
{{$json.needs_human_review}} is true
```

True path:

```text
Add alert row
Send organizer alert
```

False path:

```text
Send group recap
```

## Node 6: Respond to Webhook

Node:

```text
Respond to Webhook
```

Body:

```json
{
  "ok": true,
  "message": "VibeCampus payload received",
  "session_code": "={{$json.session_code}}",
  "priority": "={{$json.priority}}"
}
```


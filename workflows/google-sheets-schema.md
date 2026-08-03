# VibeCampus Automation - Google Sheets Schema

Create a Google Sheet named:

```text
VibeCampus Automation Logs
```

Use these tabs.

## Tab 1: Sessions

| Column | Example | Notes |
|---|---|---|
| log_id | VCLOG-1783000000000 | Unique row ID from the payload |
| created_at | 2026-08-01T10:30:00.000Z | Timestamp |
| session_code | VC-AB12 | Join/session code |
| session_title | Cultural night planning | Poll/session title |
| mode | event | event, study, rant, meme |
| question | What should we improve? | Main question |
| response_count | 7 | Number of submitted responses |
| winning_option | Friday evening | Top vote |
| vibe_score | 78 | 0-100 |
| drama_meter | 44 | 0-100 |
| priority | normal | normal, medium, high |
| needs_human_review | false | Boolean |
| suggested_channel | group_chat_summary | Routing result |
| share_summary | VibeCampus report... | Full recap |

## Tab 2: Tasks

| Column | Example | Notes |
|---|---|---|
| task_id | VC-AB12-TASK-1 | Unique task ID |
| created_at | 2026-08-01T10:30:00.000Z | Timestamp |
| session_code | VC-AB12 | Links back to session |
| title | Lock the vibe | Task title |
| details | Confirm Friday evening... | Action details |
| owner | Session owner | Suggested owner |
| priority | normal | From routing decision |
| due_hint | today | Human-friendly due hint |
| status | open | open, done, blocked |

## Tab 3: Alerts

| Column | Example | Notes |
|---|---|---|
| alert_id | ALERT-VC-AB12 | Unique alert ID |
| created_at | 2026-08-01T10:30:00.000Z | Timestamp |
| session_code | VC-AB12 | Links back to session |
| priority | high | Alert priority |
| title | Review needed... | Alert title |
| message | Drama meter is high... | Alert body |
| suggested_action | Check comments... | Next step |
| status | new | new, acknowledged, resolved |

## Tab 4: Raw Payloads

| Column | Example | Notes |
|---|---|---|
| received_at | 2026-08-01T10:30:00.000Z | Timestamp |
| session_code | VC-AB12 | Links back to session |
| event | vibecampus.vibe_report.generated | Event name |
| payload_json | {...} | Full incoming payload |


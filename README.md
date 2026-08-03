# VibeCampus

**Vote. Rant. Laugh. Decide.**

VibeCampus is a colorful AI automation project for campus feedback, study groups, clubs, and student communities. It lets users create a poll or feedback session, collect messy votes and rants, turn them into structured decision intelligence, and optionally hand the result to a Make/n8n webhook for logging, alerts, task creation, and follow-up summaries.

**Live demo:** https://hildegarht1.github.io/vibecampus/

## What It Does

- Creates campus polls and feedback sessions
- Supports event, study, rant, and meme-style modes
- Analyzes free-form responses with local AI-style logic
- Detects common themes such as budget, food, timing, venue, planning, and stress
- Generates a vibe score, drama meter, winning option, action plan, and shareable summary
- Builds a structured JSON automation payload with AI analysis, routing priority, review status, next actions, and group-chat summary
- Supports an optional webhook handoff for Make, n8n, Google Sheets, Slack, Telegram, email, or task tools
- Includes a meme caption generator, campus trend cards, daily motivation, and saved session history

## Live Make Automation MVP

The project now includes a working Make scenario that receives the VibeCampus automation payload and logs the result into Google Sheets.

Current route:

```text
VibeCampus dashboard
-> Make custom webhook
-> Parse JSON
-> Add session summary row
-> Iterate next actions
-> Add task rows
-> Add raw payload audit row
```

The connected Google Sheet uses these tabs:

```text
Sessions
Tasks
Alerts
Raw Payloads
```

The current MVP logs:

- one session summary row with session code, title, question, response count, winning option, vibe score, drama meter, priority, and review status
- one task row per generated next action
- one raw payload audit row containing the original JSON sent from the hosted dashboard

## Why It Is Different

Most poll tools stop at vote counts. VibeCampus behaves more like an agent-assisted decision workflow: it interprets messy student input, creates structured JSON, decides whether the issue needs human review, and prepares the result for automation tools while keeping the experience fun enough for students to actually use.

## Automation Flow

The current MVP includes a visible automation layer:

1. Webhook-style intake receives poll metadata and free-form responses.
2. AI-style analysis extracts themes, sentiment signals, drama level, winning option, and next actions.
3. Routing logic marks the result as normal, medium, or high priority.
4. Structured JSON can be copied or sent to a Make/n8n webhook.
5. The payload includes Google Sheets row data, task queue items, organizer alert data, and group recap text.
6. A group-chat summary is generated for WhatsApp, Telegram, Discord, or email.

## Automation Build Files

The automation implementation guide lives in:

```text
workflows/
```

Key files:

```text
workflows/VibeCampus.blueprint.json
workflows/make-scenario-design.md
workflows/n8n-workflow-design.md
workflows/google-sheets-schema.md
workflows/sample-vibecampus-payload.json
```

The Make/n8n workflow is designed around this route:

```text
VibeCampus dashboard
-> Webhook intake
-> Parse structured JSON
-> Log session to Google Sheets
-> Create task rows
-> Route high-drama sessions to organizer review
-> Send normal sessions as group recaps
```

## Screenshots

| Area | Screenshot |
| --- | --- |
| Hosted landing page | `docs/screenshots/vibecampus-hero.png` |
| Vote station | `docs/screenshots/vibecampus-vote-station.png` |
| Automation layer | `docs/screenshots/vibecampus-automation-layer.png` |
| Make scenario canvas | `docs/screenshots/make-scenario-canvas.png` |
| Google Sheets session log | `docs/screenshots/sheets-session-log.png` |
| Google Sheets task rows | `docs/screenshots/sheets-task-rows.png` |
| Raw payload audit log | `docs/screenshots/sheets-raw-payload-log.png` |

## Possible Next Integrations

- Gemini/OpenAI for hosted LLM summaries
- Supabase or Google Sheets for response storage
- Supabase/Firebase real-time shared sessions
- Telegram, WhatsApp, Discord, or email notifications
- Trello, Notion, Linear, or Google Tasks creation
- Organizer alert routing for high-drama sessions
- PDF result-card generation
- Campus news and event feeds

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

## QA Automation

VibeCampus includes a Playwright-based browser test suite that checks the most important user journeys:

- generating a vibe report from a student response
- validating that the automation payload contains structured JSON and routing data
- simulating the automation handoff when no webhook is connected
- generating a meme caption from a complaint

Run the tests:

```bash
npm install
npm test
```

This gives the project a QA automation layer that matches real product checks: form input, button flows, browser rendering, structured output validation, and regression coverage.

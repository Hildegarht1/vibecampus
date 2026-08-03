# VibeCampus - Project Documentation

## Project Overview

VibeCampus is a colorful AI-assisted campus feedback and decision automation project. It lets students create a feedback or voting session, collect structured votes and messy free-form responses, analyze the group mood, generate a decision summary, and prepare a structured automation payload for Make, n8n, Google Sheets, Slack, Telegram, email, or task tools.

The project is intentionally playful on the surface and automation-focused underneath. The student-facing experience feels like a fun campus pulse tool, while the backend logic behaves like an event-driven workflow that turns messy opinions into structured decision data.

## Problem It Solves

Student groups, clubs, study teams, and campus organizers often make decisions through chaotic group chats. People vote casually, complain, change topics, or explain their preferences in unstructured messages. That makes it hard to know:

- what option is winning
- why people prefer it
- whether the topic is low drama or high priority
- what the next action should be
- what summary should be shared back to the group
- whether the result should trigger a follow-up workflow

VibeCampus turns that chaos into a visible decision system.

## Core Features

- Hosted static web app
- Session title and generated session code
- Shareable session link
- Vote options
- Student vote station
- Free-form response collection
- Named or anonymous response support
- AI-style local analysis
- Theme detection
- Sentiment and drama scoring
- Vibe score
- Winning option
- Suggested action plan
- Shareable group-chat summary
- Meme caption generator
- Campus trend cards
- Daily motivation
- Saved session history
- Collapsible history panel
- Structured JSON automation payload
- Optional webhook handoff to Make or n8n
- Playwright browser tests

## Tools And Technologies

```text
HTML
CSS
JavaScript
GitHub Pages
Browser localStorage
Fetch API
Structured JSON
Optional Make webhook
Optional n8n webhook
Make
Google Sheets
Playwright
Node.js
```

## Workflow Architecture

```text
Student creates session
-> Session code and options generated
-> Students vote and add reasons
-> Local AI-style analysis extracts themes and mood
-> Decision logic calculates winner, score, priority, and next action
-> Dashboard renders vibe report, action plan, and meme output
-> Structured JSON payload is generated
-> Make webhook receives the payload
-> JSON module parses the payload
-> Google Sheets logs session, task rows, and raw payload audit data
```

## Completed Make Automation

The project includes a working Make automation scenario exported as:

```text
workflows/VibeCampus.blueprint.json
```

The Make scenario uses this route:

```text
Custom webhook
-> Parse JSON
-> Google Sheets: add session row
-> Iterator: loop through next_actions
-> Google Sheets: add task rows
-> Google Sheets: add raw payload audit row
```

The Google Sheet is named `VibeCampus Automation Logs` and uses four tabs:

```text
Sessions
Tasks
Alerts
Raw Payloads
```

The completed MVP stores:

- a session summary row with title, code, question, response count, winning option, vibe score, drama meter, priority, review status, and share summary
- task rows created from each generated `next_actions` item
- a raw payload audit row containing the original JSON from the dashboard
- an `event` value such as `vibecampus.vibe_report.generated` so future automations can route by event type

This proves the project is not only a hosted frontend. It is connected to an automation workflow that receives structured data, parses it, stores it, and creates repeatable task records.

## How The App Works

1. A user creates a campus feedback session.
2. The app generates a session code and shareable link.
3. The organizer defines or uses vote options.
4. Students choose a vote and add a reason, rant, suggestion, or concern.
5. The app counts votes and analyzes the written responses.
6. The analysis detects themes such as budget, food, timing, venue, planning, stress, or confusion.
7. The dashboard shows the leading option, vibe score, drama meter, AI-style summary, and suggested next move.
8. A structured automation payload is generated.
9. If a Make or n8n webhook URL is added, the payload can be sent into an automation scenario.
10. If no webhook is connected, the app remains a fully usable local demo.

## Automation Payload

The automation payload is designed so another tool can understand the session without scraping the UI.

Example structure:

```json
{
  "source": "vibecampus",
  "session": {
    "code": "VC-4821",
    "title": "Cultural night planning"
  },
  "votes": {
    "winner": "Friday evening",
    "counts": {
      "Friday evening": 4,
      "Saturday afternoon": 2
    }
  },
  "analysis": {
    "vibeScore": 78,
    "themes": ["timing", "food", "budget"],
    "summary": "Most students prefer Friday, but budget concerns need review."
  },
  "routing": {
    "priority": "medium",
    "suggestedRoute": "organizer-review"
  }
}
```

The current payload also includes richer production-oriented fields:

- `event`
- `source`
- `mode`
- `created_at`
- `participants`
- `responses`
- `ai_analysis`
- `routing`
- `next_actions`
- `automation_outputs`
- `share_summary`

These fields make it easier for Make, n8n, or another automation tool to log the result, route urgent issues, create task rows, and send recap messages.

## Why It Is Different

Most poll tools stop at counting votes. VibeCampus adds an automation layer:

- free-form comments are interpreted
- group mood is summarized
- response themes are detected
- priority is calculated
- the next action is recommended
- a structured JSON payload is prepared for external workflows

That makes the project more than a frontend poll. It becomes a lightweight AI automation interface for campus decision-making.

## QA Automation

The project includes Playwright browser tests that check important user journeys:

- generating a vibe report from a student response
- validating that the automation payload contains structured JSON and routing data
- simulating webhook handoff when no webhook is connected
- generating a meme caption from a complaint

This gives the project a test automation layer that is useful for interviews involving QA automation, product tooling, or internal workflow reliability.

## Problems Faced And Fixes

### 1. The first version felt too cluttered

Problem:
The app had too much happening in one view, including a menu sidebar and a saved history panel.

Fix:
The layout was simplified, visual hierarchy was improved, and saved sessions were made collapsible so the main workflow stays easier to understand.

### 2. Navigation highlight did not follow scrolling

Problem:
The sidebar highlight stayed on the previous section even when the user scrolled to another area.

Fix:
Scroll-aware section behavior was improved so the active navigation state better reflects the visible section.

### 3. The project risked looking like only a fun frontend

Problem:
The visual style was playful, but the automation value needed to stay visible.

Fix:
The project now includes an explicit automation section, structured JSON payload, optional webhook field, local route status, and handoff logic for Make/n8n.

### 4. Vote flow was unclear

Problem:
The first version allowed students to submit responses, but the voting behavior was not obvious enough.

Fix:
The app now includes visible vote options, selected vote feedback, vote counts, and response reasons so users can both vote and explain why.

### 5. GitHub Pages returned 404 during hosting setup

Problem:
The repository files were pushed, but GitHub Pages did not serve the project immediately.

Fix:
The Pages settings were reviewed, the branch/root setup was corrected, and deployment was allowed time to finish.

### 6. Static hosting needed a build output

Problem:
Some hosting flows expect a static output folder.

Fix:
The project includes a build script that prepares the static files in `dist/` for hosting.

### 7. Make initially exposed the webhook body as one long JSON string

Problem:
The Make webhook received the VibeCampus payload, but the Google Sheets module could only see one raw `value` field. That made it hard to map columns like `event`, `session_code`, or `priority`.

Fix:
A JSON parsing module was added after the webhook. The raw webhook `value` is parsed into structured fields, so Make can map nested values such as `session.code`, `routing.priority`, and `next_actions`.

### 8. Task rows needed one row per action item

Problem:
The generated action plan is an array. If mapped directly into Google Sheets, it would not naturally create separate task rows.

Fix:
An Iterator module was added to loop over `next_actions`. Each action becomes its own task row in the `Tasks` tab.

### 9. Audit logging needed the full original payload

Problem:
Mapped columns are useful, but they do not preserve everything sent by the dashboard.

Fix:
A `Raw Payloads` tab was added. It stores the original full JSON string for debugging, replay, and audit purposes.

### 10. Shareable session links are not yet truly multi-user

Problem:
The share link carries the same session code, but the current hosted version still stores responses in each user's browser.

Fix:
The limitation is documented clearly. The next production step is a shared backend with Supabase or Firebase so every participant lands in the same persistent session.

## Current Limitations

- The current version uses browser localStorage rather than a real user database.
- Webhook handoff works with Make, but the URL is intentionally entered by the user rather than hard-coded.
- There is no authentication yet.
- The local AI-style analysis is deterministic and lightweight, not a hosted LLM.
- Multi-user live voting is simulated through the browser state rather than a shared backend.
- Saved history is local to the browser.
- The current Make route logs session, tasks, and raw payload data; alert routing and notifications are planned next.

## Future Add-Ons

- Supabase authentication for student accounts
- Real-time voting with Supabase Realtime or Firebase
- Persistent shared session database
- Role-based organizer dashboard
- Router branch for high-drama organizer alerts
- Email, Telegram, Discord, or WhatsApp recap delivery
- Telegram, WhatsApp, or Discord group recap
- Moderation queue for inappropriate responses
- Gemini or OpenAI summary generation
- Make AI or n8n AI Agent replacement for the local analysis layer
- Campus news feed
- Meme image generation
- Event recommendation engine
- Mobile PWA installation
- Admin analytics across sessions
- QR code sharing for live events

## Interview Talking Points

- I designed the surface to be fun for students, but the core is an automation workflow.
- I turned unstructured votes and comments into structured JSON.
- I added webhook handoff so Make or n8n can log results, notify teams, or create follow-up tasks.
- I connected the hosted app to Make, parsed the JSON payload, logged session data in Google Sheets, iterated generated action items into task rows, and stored the raw payload for auditability.
- I used Playwright to test key user journeys.
- I improved the UI based on usability feedback instead of stopping at the first design.
- The project can evolve into a real campus product with accounts, shared sessions, and automation integrations.

## Screenshots And Proof Artifacts

```text
workflows/VibeCampus.blueprint.json
docs/screenshots/make-scenario-canvas.png
docs/screenshots/sheets-session-log.png
docs/screenshots/sheets-task-rows.png
docs/screenshots/sheets-raw-payload-log.png
docs/screenshots/vibecampus-hero.png
docs/screenshots/vibecampus-vote-station.png
docs/screenshots/vibecampus-automation-layer.png
docs/screenshots/vibecampus-navigation.png
```

## Project Links

```text
Source code: https://github.com/Hildegarht1/vibecampus
Hosted app: https://hildegarht1.github.io/vibecampus/
Local project folder: vibecampus
```

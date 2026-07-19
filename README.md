# VibeCampus

**Vote. Rant. Laugh. Decide.**

VibeCampus is a colorful AI automation project for campus feedback, study groups, clubs, and student communities. It lets users create a poll or feedback session, collect messy votes and rants, turn them into structured decision intelligence, and optionally hand the result to a Make/n8n webhook for logging, alerts, task creation, and follow-up summaries.

## What It Does

- Creates campus polls and feedback sessions
- Supports event, study, rant, and meme-style modes
- Analyzes free-form responses with local AI-style logic
- Detects common themes such as budget, food, timing, venue, planning, and stress
- Generates a vibe score, drama meter, winning option, action plan, and shareable summary
- Builds a structured JSON automation payload with AI analysis, routing priority, review status, next actions, and group-chat summary
- Supports an optional webhook handoff for Make, n8n, Google Sheets, Slack, Telegram, email, or task tools
- Includes a meme caption generator, campus trend cards, daily motivation, and saved session history

## Why It Is Different

Most poll tools stop at vote counts. VibeCampus behaves more like an agent-assisted decision workflow: it interprets messy student input, creates structured JSON, decides whether the issue needs human review, and prepares the result for automation tools while keeping the experience fun enough for students to actually use.

## Automation Flow

The current MVP includes a visible automation layer:

1. Webhook-style intake receives poll metadata and free-form responses.
2. AI-style analysis extracts themes, sentiment signals, drama level, winning option, and next actions.
3. Routing logic marks the result as normal, medium, or high priority.
4. Structured JSON can be copied or sent to a Make/n8n webhook.
5. A group-chat summary is generated for WhatsApp, Telegram, Discord, or email.

## Possible Next Integrations

- Gemini/OpenAI for hosted LLM summaries
- Supabase or Google Sheets for response storage
- Telegram, WhatsApp, Discord, or email notifications
- Trello, Notion, Linear, or Google Tasks creation
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

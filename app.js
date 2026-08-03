const templates = {
  cultural: {
    title: "Cultural night planning",
    question: "What should we improve for the next cultural night?",
    options: ["Friday evening", "Saturday afternoon", "Sunday chill session", "Let the group chat decide"],
    responses: [
      "Friday evening works best but tickets should stay cheap. The last food queue was too long.",
      "More African food please. The music was great but the room got packed fast.",
      "Saturday is easier for people coming from work. Bigger venue would help.",
      "I loved the vibe, but promotion started too late. People need the flyer earlier.",
      "Friday wins for me. Budget is the only thing stressing people.",
      "Can we have a volunteer list before the day? Last time everyone was confused."
    ]
  },
  study: {
    title: "Database study group",
    question: "When should we meet and what should we focus on?",
    options: ["Thursday evening", "Friday morning", "Sunday library session", "Online crash call"],
    responses: [
      "Thursday evening is best. I need help with normalization and SQL joins.",
      "Sunday library session please. I am behind and need a quiet room.",
      "Friday morning is too early. We should split chapters and share notes.",
      "I can explain ER diagrams but I need someone to cover transactions.",
      "Online call is fine if people actually show up. We need a checklist.",
      "Thursday works. Bring snacks because morale is not looking strong."
    ]
  },
  exam: {
    title: "Exam stress check",
    question: "How is everyone feeling about next week's exam?",
    options: ["Academic weapon mode", "Mild panic", "Still opening week 1 slides", "Group study emergency"],
    responses: [
      "Mild panic. I understand the examples but not the theory.",
      "Group study emergency. Week 1 slides are judging me.",
      "I am okay with past questions but need a formula sheet.",
      "Please can someone summarize the last lecture? It moved too fast.",
      "Academic weapon mode if we meet twice before Monday.",
      "The stress is loud. We need a shared doc and a realistic plan."
    ]
  },
  food: {
    title: "Campus food vote",
    question: "What food situation needs fixing first?",
    options: ["Cheaper lunch", "More vegetarian meals", "Longer cafe hours", "Better snacks"],
    responses: [
      "Cheaper lunch. My bank account is doing side quests.",
      "More vegetarian meals would be nice, especially after 2pm.",
      "The cafe closing early is painful during study weeks.",
      "Better snacks please. Some days dinner is just vibes and biscuits.",
      "Cheaper lunch wins but quality should not vanish.",
      "Longer hours during exam season would save lives academically."
    ]
  }
};

const boosts = [
  "Your future self is begging you to open the slides today.",
  "Romanticize the library. Hydrate. Submit the thing.",
  "One small task before scrolling. That is the treaty.",
  "Today is not for panic. Today is for a tiny Google Doc.",
  "If the group chat is chaotic, make a poll and free yourself.",
  "Academic comeback loading. Please keep your charger nearby."
];

const campusNews = [
  "Study room demand is high this week. Book early or prepare your floor era.",
  "Campus groups are planning summer events. Volunteers are suddenly very popular.",
  "Exam season mood: 62% caffeine, 28% denial, 10% actual revision.",
  "International students are sharing visa appointment tips in group chats.",
  "Library seats remain the unofficial campus Hunger Games."
];

const trendCards = [
  { icon: "📚", title: "Study group SOS", text: "Students want smaller revision groups, shared notes, and less fake confidence." },
  { icon: "🍕", title: "Food budget drama", text: "Cheap meals are trending. The vibe says: tasty, filling, not financially violent." },
  { icon: "🎉", title: "Event season", text: "Cultural nights, game nights, and karaoke polls are getting the most reactions." },
  { icon: "🏠", title: "Housing rants", text: "Rent, deposits, and mysterious landlords are still undefeated campus villains." },
  { icon: "🚌", title: "Transport timing", text: "Late buses and missed connections are showing up in daily complaints." },
  { icon: "💸", title: "Student money check", text: "Budget stress is high, but free food still fixes 37% of emotional damage." },
  { icon: "😂", title: "Meme of the week", text: "When you say 'quick meeting' and open a 47-slide agenda." },
  { icon: "✨", title: "Campus win", text: "More groups are using polls before planning events. Democracy, but cute." }
];

const memeCaptions = [
  "When {topic} enters the chat and suddenly everyone has trauma.",
  "POV: {topic} saw your deadline and chose chaos.",
  "Me pretending {topic} is fine because the semester is already dramatic.",
  "{topic}, but make it character development.",
  "The campus group chat after {topic}: typing... typing... typing...",
  "When {topic} happens and your academic comeback needs a comeback."
];

const keywords = {
  budget: ["budget", "cheap", "expensive", "price", "cost", "money", "ticket", "broke"],
  food: ["food", "snack", "pizza", "lunch", "vegetarian", "meal", "queue"],
  timing: ["friday", "saturday", "sunday", "morning", "evening", "deadline", "early", "late", "time"],
  venue: ["venue", "room", "library", "seat", "packed", "space", "bigger"],
  planning: ["plan", "checklist", "volunteer", "organize", "flyer", "promotion", "share", "notes"],
  stress: ["stress", "panic", "behind", "confused", "deadline", "exam", "hard", "fast"],
  positive: ["love", "great", "best", "nice", "works", "okay", "fine", "excited", "slay"],
  negative: ["too long", "bad", "painful", "confused", "stress", "panic", "late", "problem", "wild"]
};

let state = {
  mode: "event",
  sessionCode: createSessionCode(),
  responses: hydrateResponses(templates.cultural.responses, templates.cultural.options),
  selectedVote: templates.cultural.options[0],
  lastReport: null
};

const $ = (id) => document.getElementById(id);

function init() {
  hydrateSessionFromUrl();
  renderSessionMeta();
  renderNews();
  renderTrends();
  renderVoteOptions();
  renderResponses();
  renderHistory();
  bindEvents();
  runAnalysis();
}

function bindEvents() {
  document.querySelectorAll(".mode-chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      state.mode = button.dataset.mode;
    });
  });

  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => loadTemplate(button.dataset.template));
  });

  $("addResponse").addEventListener("click", addResponse);
  $("clearResponses").addEventListener("click", () => {
    state.responses = [];
    renderResponses();
    renderVoteOptions();
    runAnalysis();
    showToast("Responses cleared.");
  });
  $("optionsInput").addEventListener("input", () => {
    const options = getOptions();
    if (!options.includes(state.selectedVote)) state.selectedVote = options[0] || "";
    renderVoteOptions();
    runAnalysis();
  });
  $("runVibeCheck").addEventListener("click", runAnalysis);
  $("copySummary").addEventListener("click", copySummary);
  $("saveSession").addEventListener("click", saveSession);
  $("newSessionCode").addEventListener("click", refreshSessionCode);
  $("copySessionLink").addEventListener("click", copySessionLink);
  $("toggleHistory").addEventListener("click", toggleHistoryPanel);
  $("clearHistory").addEventListener("click", clearHistory);
  $("shuffleBoost").addEventListener("click", shuffleBoost);
  $("generateMeme").addEventListener("click", generateMeme);
  $("sendAutomation").addEventListener("click", sendAutomation);
  $("copyPayload").addEventListener("click", copyPayload);
  $("webhookUrl").addEventListener("input", updateAutomationRoute);
  bindNavLinks();
}

function bindNavLinks() {
  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNav(link.getAttribute("href"));
      window.setTimeout(() => updateActiveNavFromScroll(sections), 280);
    });
  });

  window.addEventListener("scroll", () => updateActiveNavFromScroll(sections), { passive: true });
  window.addEventListener("resize", () => updateActiveNavFromScroll(sections));
  updateActiveNavFromScroll(sections);
}

function updateActiveNavFromScroll(sections) {
  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12;

  if (pageBottom && sections.length) {
    setActiveNav(`#${sections[sections.length - 1].id}`);
    return;
  }

  const anchorLine = Math.min(window.innerHeight * 0.52, 390);
  const current =
    sections
      .map((section) => {
        const rect = section.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));

        return {
          id: `#${section.id}`,
          top: rect.top,
          bottom: rect.bottom,
          visibleHeight
        };
      })
      .filter((item) => item.visibleHeight > 0 && item.top <= anchorLine)
      .sort((a, b) => {
        const anchorDistance = Math.abs(a.top - anchorLine) - Math.abs(b.top - anchorLine);
        return anchorDistance || b.visibleHeight - a.visibleHeight;
      })[0] || { id: "#create" };

  setActiveNav(current.id);
}

function setActiveNav(hash) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function loadTemplate(name) {
  const template = templates[name];
  $("sessionTitle").value = template.title;
  $("questionInput").value = template.question;
  $("optionsInput").value = template.options.join("\n");
  state.responses = hydrateResponses(template.responses, template.options);
  state.selectedVote = template.options[0];
  renderVoteOptions();
  renderResponses();
  runAnalysis();
  showToast("Demo vibe loaded.");
}

function renderNews() {
  $("campusNews").innerHTML = campusNews
    .slice(0, 4)
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function renderTrends() {
  $("trendGrid").innerHTML = trendCards
    .map(
      (card) => `
        <article class="trend-card">
          <strong>${card.icon}</strong>
          <h4>${card.title}</h4>
          <p>${card.text}</p>
        </article>
      `
    )
    .join("");
}

function renderResponses() {
  if (!state.responses.length) {
    $("responseList").innerHTML = `<p class="muted">No responses yet. Add a rant, vote reason, or study group complaint.</p>`;
    return;
  }

  $("responseList").innerHTML = state.responses
    .map(
      (response, index) => `
        <article class="response-item">
          <div class="response-meta">
            <span>${escapeHtml(response.author)} ${response.anonymous ? "(anonymous)" : ""} · response ${index + 1}</span>
            <span>${pickEmoji(response.text)}</span>
          </div>
          <strong class="vote-chip">Vote: ${escapeHtml(response.vote || "No vote")}</strong>
          <p>${escapeHtml(response.text)}</p>
        </article>
      `
    )
    .join("");
}

function addResponse() {
  const value = $("newResponse").value.trim();
  if (!state.selectedVote) {
    showToast("Choose a vote first.");
    return;
  }
  const anonymous = $("anonymousMode").checked;
  const rawName = $("studentName").value.trim();
  state.responses.unshift({
    id: `rsp-${Date.now()}`,
    text: value || `Voted for ${state.selectedVote}.`,
    vote: state.selectedVote,
    author: anonymous ? "Anonymous" : rawName || "Campus student",
    anonymous,
    createdAt: new Date().toISOString()
  });
  $("newResponse").value = "";
  renderResponses();
  renderVoteOptions();
  runAnalysis();
}

function runAnalysis() {
  const title = $("sessionTitle").value.trim() || "Untitled campus vibe";
  const question = $("questionInput").value.trim() || "What is the campus saying?";
  const options = getOptions();
  const responses = state.responses.map((response) => response.text);
  const text = responses.join(" ").toLowerCase();
  const voteCounts = getVoteCounts(options);

  const themeScores = Object.entries(keywords).map(([theme, words]) => {
    const score = words.reduce((total, word) => total + countMatches(text, word), 0);
    return { theme, score };
  });

  const rankedThemes = themeScores
    .filter((item) => item.score > 0 && !["positive", "negative"].includes(item.theme))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const positive = themeScores.find((x) => x.theme === "positive")?.score || 0;
  const negative = themeScores.find((x) => x.theme === "negative")?.score || 0;
  const vibeScore = clamp(58 + positive * 5 - negative * 4 + responses.length * 2, 28, 96);
  const drama = clamp(negative * 13 + rankedThemes.length * 8 + disagreementScore(options, text), 12, 94);
  const winning = pickWinningOption(options, text, voteCounts);
  const meme = buildMemeStatus(rankedThemes, vibeScore, drama);
  const actions = buildActions(title, winning, rankedThemes, question);
  const summary = buildShareSummary(title, winning, vibeScore, drama, rankedThemes, actions, meme);

  state.lastReport = {
    title,
    question,
    winning,
    vibeScore,
    drama,
    themes: rankedThemes,
    voteCounts,
    actions,
    summary,
    meme
  };

  $("vibeScore").textContent = `${vibeScore}%`;
  $("vibeLabel").textContent = vibeScore > 78 ? "immaculate" : vibeScore > 60 ? "solid" : "messy";
  $("vibeSummary").textContent = buildVibeSummary(vibeScore, rankedThemes);
  $("dramaBar").style.width = `${drama}%`;
  $("dramaLevel").textContent = drama > 70 ? "spicy" : drama > 45 ? "mixed" : "low";
  $("dramaText").textContent = buildDramaText(drama);
  $("winningOption").textContent = winning;
  $("winningReason").textContent = `The strongest signals point toward "${winning}" as the cleanest next move.`;
  $("memeStatus").textContent = meme;
  $("themeList").innerHTML = renderThemes(rankedThemes, positive, negative);
  $("actionList").innerHTML = actions
    .map(
      (action) => `
        <article class="action-card">
          <span>${action.icon}</span>
          <div>
            <strong>${action.title}</strong>
            <p>${action.text}</p>
          </div>
        </article>
      `
    )
    .join("");
  $("shareSummary").value = summary;
  renderAutomationPayload();
}

function countMatches(text, word) {
  if (word.includes(" ")) return text.includes(word) ? 1 : 0;
  return text.split(/\W+/).filter((item) => item === word).length;
}

function disagreementScore(options, text) {
  const mentions = options.map((option) => countMatches(text, option.toLowerCase().split(" ")[0]));
  const nonZero = mentions.filter(Boolean).length;
  return nonZero > 2 ? 24 : nonZero > 1 ? 12 : 4;
}

function pickWinningOption(options, text, voteCounts = {}) {
  if (!options.length) return "Add options to pick a winner";
  const countedVotes = Object.values(voteCounts).reduce((total, count) => total + count, 0);
  if (countedVotes > 0) {
    return Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0][0];
  }
  const scored = options.map((option, index) => {
    const words = option.toLowerCase().split(/\W+/).filter((word) => word.length > 3);
    const score = words.reduce((total, word) => total + countMatches(text, word), 0) + (options.length - index) * 0.15;
    return { option, score };
  });
  return scored.sort((a, b) => b.score - a.score)[0].option;
}

function renderThemes(themes, positive, negative) {
  const themeIcons = {
    budget: "💸",
    food: "🍕",
    timing: "⏰",
    venue: "🏛️",
    planning: "🧠",
    stress: "😭"
  };
  const chips = themes.map((item) => `<span class="tag">${themeIcons[item.theme] || "✨"} ${capitalize(item.theme)} · ${item.score}</span>`);
  chips.push(`<span class="tag">💚 Positive signals · ${positive}</span>`);
  chips.push(`<span class="tag">🚩 Risk signals · ${negative}</span>`);
  return chips.join("");
}

function buildVibeSummary(score, themes) {
  const topic = themes[0]?.theme || "campus mood";
  if (score > 78) return `The campus vibe is warm. People are engaged, and the biggest theme is ${topic}.`;
  if (score > 60) return `The vibe is usable but mixed. People want a decision, especially around ${topic}.`;
  return `The vibe needs care. People are responding, but the group needs clarity before deciding.`;
}

function buildDramaText(drama) {
  if (drama > 70) return "High spice. The result needs explanation before the group chat starts a second meeting.";
  if (drama > 45) return "Some disagreement. Not dangerous, but do not ignore the side comments.";
  return "Low drama. People mostly agree, which is rare and should be celebrated.";
}

function buildMemeStatus(themes, score, drama) {
  const main = themes[0]?.theme || "the group chat";
  if (drama > 70) return `"${capitalize(main)} entered the chat and chose violence."`;
  if (score > 78) return `"The vibe is giving organized chaos, but make it productive."`;
  return `"Everyone says they are chill. The comments determined that was a lie."`;
}

function buildActions(title, winning, themes, question) {
  const main = themes[0]?.theme || "feedback";
  const secondary = themes[1]?.theme || "planning";
  return [
    {
      icon: "✅",
      title: "Lock the vibe",
      text: `Confirm "${winning}" as the current decision unless new votes change the group mood.`
    },
    {
      icon: "🙋",
      title: "Assign one human",
      text: `Ask one organizer to own the ${main} concern and post a short update today.`
    },
    {
      icon: "🗳️",
      title: "Run a tiny follow-up",
      text: `Create a mini-poll for ${secondary} so quiet people still get a say before the plan is final.`
    },
    {
      icon: "📣",
      title: "Drop the group-chat recap",
      text: "Share the summary, give people 24 hours to react, then stop reopening the same debate."
    }
  ];
}

function buildShareSummary(title, winning, vibeScore, drama, themes, actions, meme) {
  const themeText = themes.length ? themes.map((item) => capitalize(item.theme)).join(", ") : "general feedback";
  return `VibeCampus report for ${title}

Winning vibe: ${winning}
Vibe score: ${vibeScore}%
Drama meter: ${drama}%
Top themes: ${themeText}
Meme status: ${meme}

Next moves:
- ${actions.map((action) => `${action.title}: ${action.text}`).join("\n- ")}

Vote. Rant. Laugh. Decide.`;
}

function buildAutomationPayload() {
  if (!state.lastReport) runAnalysis();
  const routing = buildRoutingDecision();
  const rowId = `VCLOG-${Date.now()}`;
  const sheetRow = buildSheetRow(rowId, routing);
  const groupRecap = buildGroupRecap(routing);
  const taskQueue = state.lastReport.actions.map((action, index) => ({
    task_id: `${state.sessionCode}-TASK-${index + 1}`,
    title: action.title,
    details: action.text,
    owner: routing.needs_human_review ? "Campus organizer" : "Session owner",
    status: "open",
    priority: routing.priority,
    due_hint: index === 0 ? "today" : index === 1 ? "24 hours" : "before final decision"
  }));

  return {
    event: "vibecampus.vibe_report.generated",
    source: "VibeCampus dashboard",
    mode: state.mode,
    created_at: new Date().toISOString(),
    session: {
      code: state.sessionCode,
      title: state.lastReport.title,
      question: state.lastReport.question,
      share_link: buildShareLink(),
      response_count: state.responses.length
    },
    votes: {
      selected_options: getOptions(),
      counts: state.lastReport.voteCounts
    },
    participants: {
      named_count: state.responses.filter((response) => !response.anonymous).length,
      anonymous_count: state.responses.filter((response) => response.anonymous).length,
      submitters: [...new Set(state.responses.map((response) => response.author))]
    },
    responses: state.responses.map((response) => ({
      id: response.id,
      author: response.author,
      anonymous: response.anonymous,
      vote: response.vote,
      text: response.text,
      created_at: response.createdAt
    })),
    ai_analysis: {
      vibe_score: state.lastReport.vibeScore,
      drama_meter: state.lastReport.drama,
      winning_option: state.lastReport.winning,
      meme_status: state.lastReport.meme,
      summary: buildVibeSummary(state.lastReport.vibeScore, state.lastReport.themes),
      themes: state.lastReport.themes.map((item) => ({
        label: item.theme,
        score: item.score
      }))
    },
    routing,
    automation_outputs: {
      google_sheets_row: sheetRow,
      task_queue: taskQueue,
      organizer_alert: routing.needs_human_review ? buildOrganizerAlert(routing) : null,
      group_recap: groupRecap
    },
    next_actions: taskQueue.map((task) => ({
      title: task.title,
      details: task.details,
      owner: task.owner,
      priority: task.priority,
      status: task.status
    })),
    share_summary: state.lastReport.summary
  };
}

function buildRoutingDecision() {
  const priority = state.lastReport.drama > 70 ? "high" : state.lastReport.vibeScore < 60 ? "medium" : "normal";
  const needsHumanReview = state.lastReport.drama > 70 || state.lastReport.vibeScore < 55;
  const suggestedChannel = needsHumanReview ? "organizer_alert" : "group_chat_summary";
  const reviewReason = needsHumanReview
    ? "High drama or low confidence means an organizer should review before posting."
    : "Group mood is stable enough for an automated recap.";

  return {
    priority,
    suggested_channel: suggestedChannel,
    needs_human_review: needsHumanReview,
    review_reason: reviewReason,
    automation_path: needsHumanReview ? "alert_organizer_then_log" : "log_and_post_recap"
  };
}

function buildSheetRow(rowId, routing) {
  return {
    log_id: rowId,
    created_at: new Date().toISOString(),
    session_code: state.sessionCode,
    session_title: state.lastReport.title,
    mode: state.mode,
    question: state.lastReport.question,
    response_count: state.responses.length,
    winning_option: state.lastReport.winning,
    vibe_score: state.lastReport.vibeScore,
    drama_meter: state.lastReport.drama,
    priority: routing.priority,
    needs_human_review: routing.needs_human_review,
    suggested_channel: routing.suggested_channel,
    share_summary: state.lastReport.summary
  };
}

function buildOrganizerAlert(routing) {
  return {
    title: `Review needed: ${state.lastReport.title}`,
    message: `${state.lastReport.title} has ${routing.priority} priority. Drama meter is ${state.lastReport.drama}% and the winning option is "${state.lastReport.winning}". Review before posting the group recap.`,
    suggested_action: "Check comments, confirm the decision, then post the recap."
  };
}

function buildGroupRecap(routing) {
  return {
    channel: routing.suggested_channel,
    message: state.lastReport.summary,
    short_caption: `${state.lastReport.winning} is leading with ${state.lastReport.vibeScore}% vibe. ${routing.needs_human_review ? "Organizer review needed." : "Ready to post."}`
  };
}

function hydrateResponses(responses, options = []) {
  const sampleNames = ["Ama", "Max", "Lea", "Sam", "Mina", "Theo", "Hilda", "Group chat"];
  return responses.map((response, index) => {
    if (typeof response === "object" && response.text) return response;
    return {
      id: `demo-${index + 1}`,
      text: response,
      vote: inferVote(response, options, index),
      author: sampleNames[index % sampleNames.length],
      anonymous: false,
      createdAt: new Date(Date.now() - (index + 1) * 90000).toISOString()
    };
  });
}

function getOptions() {
  return $("optionsInput").value.split("\n").map((x) => x.trim()).filter(Boolean);
}

function inferVote(response, options, index) {
  if (!options.length) return "";
  const lower = response.toLowerCase();
  const match = options.find((option) => lower.includes(option.toLowerCase().split(" ")[0]));
  return match || options[index % options.length];
}

function getVoteCounts(options) {
  return options.reduce((counts, option) => {
    counts[option] = state.responses.filter((response) => response.vote === option).length;
    return counts;
  }, {});
}

function renderVoteOptions() {
  const options = getOptions();
  if (!options.length) {
    $("voteOptions").innerHTML = `<p class="muted">Add options to create vote buttons.</p>`;
    $("studentVoteOptions").innerHTML = `<p class="muted">No vote options yet.</p>`;
    $("selectedVoteLabel").textContent = "none selected";
    return;
  }

  if (!options.includes(state.selectedVote)) state.selectedVote = options[0];
  const voteCounts = getVoteCounts(options);
  const renderButton = (option) => `
    <button class="vote-option ${option === state.selectedVote ? "selected" : ""}" data-vote="${escapeHtml(option)}" type="button">
      <span>${escapeHtml(option)}</span>
      <strong>${voteCounts[option] || 0}</strong>
    </button>
  `;

  $("voteOptions").innerHTML = options.map(renderButton).join("");
  $("studentVoteOptions").innerHTML = options.map(renderButton).join("");
  $("selectedVoteLabel").textContent = state.selectedVote;

  document.querySelectorAll("[data-vote]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedVote = button.dataset.vote;
      renderVoteOptions();
    });
  });
}

function createSessionCode() {
  return `VC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function hydrateSessionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("session");
  if (code) state.sessionCode = code.toUpperCase();
}

function buildShareLink() {
  const url = new URL(window.location.href);
  url.searchParams.set("session", state.sessionCode);
  url.hash = "create";
  return url.toString();
}

function renderSessionMeta() {
  $("sessionCode").textContent = state.sessionCode;
  $("shareLink").value = buildShareLink();
}

function refreshSessionCode() {
  state.sessionCode = createSessionCode();
  renderSessionMeta();
  renderAutomationPayload();
  showToast("New session code ready.");
}

async function copySessionLink() {
  const link = buildShareLink();
  $("shareLink").value = link;
  try {
    await navigator.clipboard.writeText(link);
    showToast("Session link copied.");
  } catch {
    $("shareLink").select();
    document.execCommand("copy");
    showToast("Session link selected.");
  }
}

function renderAutomationPayload() {
  const payload = buildAutomationPayload();
  $("automationPayload").textContent = JSON.stringify(payload, null, 2);
  $("automationPreviewRoute").textContent = payload.routing.automation_path;
  $("automationPreviewReview").textContent = payload.routing.needs_human_review ? "needed" : "not needed";
  $("automationPreviewTasks").textContent = `${payload.automation_outputs.task_queue.length} ready`;
  updateAutomationRoute();
}

function updateAutomationRoute() {
  const hasWebhook = Boolean($("webhookUrl").value.trim());
  $("payloadRoute").textContent = hasWebhook ? "webhook ready" : "local route";
  $("automationStatus").textContent = hasWebhook
    ? "Webhook ready. The next handoff will send this structured JSON to your automation scenario."
    : "Local demo mode. Add a webhook when you want to connect Make, n8n, Sheets, Slack, Telegram, or email.";
}

async function sendAutomation() {
  const payload = buildAutomationPayload();
  const webhookUrl = $("webhookUrl").value.trim();

  if (!webhookUrl) {
    $("automationStatus").textContent = `Simulated automation run: ${payload.routing.priority} priority routed to ${payload.routing.suggested_channel}.`;
    showToast("Automation simulated.");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
    $("automationStatus").textContent = "Payload sent. Check your Make/n8n scenario history for the incoming webhook run.";
    showToast("Webhook handoff sent.");
  } catch {
    $("automationStatus").textContent = "Webhook handoff failed. Check the URL, browser permissions, or use the local payload preview.";
    showToast("Webhook failed.");
  }
}

async function copyPayload() {
  const payload = $("automationPayload").textContent;
  try {
    await navigator.clipboard.writeText(payload);
    showToast("Payload copied.");
  } catch {
    showToast("Select the payload to copy.");
  }
}

function pickEmoji(response) {
  const lower = response.toLowerCase();
  if (lower.includes("food") || lower.includes("snack") || lower.includes("pizza")) return "🍕";
  if (lower.includes("stress") || lower.includes("panic") || lower.includes("exam")) return "😭";
  if (lower.includes("love") || lower.includes("great")) return "✨";
  if (lower.includes("budget") || lower.includes("cheap") || lower.includes("money")) return "💸";
  if (lower.includes("friday") || lower.includes("saturday") || lower.includes("sunday")) return "⏰";
  return "💬";
}

async function copySummary() {
  const value = $("shareSummary").value;
  try {
    await navigator.clipboard.writeText(value);
    showToast("Summary copied.");
  } catch {
    $("shareSummary").select();
    document.execCommand("copy");
    showToast("Summary selected.");
  }
}

function saveSession() {
  if (!state.lastReport) runAnalysis();
  const saved = getHistory();
  saved.unshift({
    title: state.lastReport.title,
    score: state.lastReport.vibeScore,
    winning: state.lastReport.winning,
    date: new Date().toLocaleString()
  });
  localStorage.setItem("vibecampus-history", JSON.stringify(saved.slice(0, 8)));
  renderHistory();
  showToast("Vibe saved.");
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("vibecampus-history")) || [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    $("historyList").innerHTML = `<p class="muted">No saved sessions yet.</p>`;
    return;
  }
  $("historyList").innerHTML = history
    .map(
      (item) => `
        <article class="history-card">
          <strong>${escapeHtml(item.title)}</strong>
          <span>${item.score}% vibe · ${escapeHtml(item.winning)}</span>
          <span>${escapeHtml(item.date)}</span>
        </article>
      `
    )
    .join("");
}

function clearHistory() {
  localStorage.removeItem("vibecampus-history");
  renderHistory();
}

function toggleHistoryPanel() {
  const panel = document.querySelector(".history-panel");
  const collapsed = panel.classList.toggle("collapsed");
  $("toggleHistory").textContent = collapsed ? "+" : "-";
  $("toggleHistory").setAttribute("aria-label", collapsed ? "Expand saved vibes" : "Collapse saved vibes");
}

function shuffleBoost() {
  $("dailyBoost").textContent = boosts[Math.floor(Math.random() * boosts.length)];
}

function generateMeme() {
  const input = $("memeInput").value.trim() || "campus chaos";
  const topic = input
    .replace(/[.!?]+$/g, "")
    .split(" ")
    .slice(0, 8)
    .join(" ");
  const template = memeCaptions[Math.floor(Math.random() * memeCaptions.length)];
  $("memeCaption").textContent = template.replace("{topic}", topic);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

init();

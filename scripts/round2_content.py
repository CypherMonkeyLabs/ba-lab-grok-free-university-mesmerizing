"""Round 2 study packs. Facts stay tied to sources already opened for this lab."""

BABOK = ("BABOK Guide knowledge hub", "https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/")
SCRUM = ("The 2020 Scrum Guide", "https://scrumguides.org/scrum-guide.html")
BPMN = ("OMG BPMN 2.0", "https://www.omg.org/spec/BPMN/2.0/About-BPMN")
STORIES = ("Atlassian, user stories", "https://www.atlassian.com/agile/project-management/user-stories")
GHERKIN = ("Gherkin reference", "https://cucumber.io/docs/gherkin/reference/")
C4 = ("C4 model", "https://c4model.com/")
HEART = ("Google Research, user-centered metrics paper", "https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/")
OKR = ("re:Work OKRs guide", "https://rework.withgoogle.com/guides/set-goals-with-okrs/steps/introduction/")
ADKAR = ("Prosci ADKAR model", "https://www.prosci.com/methodology/adkar")
JTBD = ("Christensen Institute, Jobs to Be Done", "https://www.christenseninstitute.org/theory/jobs-to-be-done/")
IDEO = ("IDEO Design Thinking", "https://designthinking.ideo.com/")
FAQ = ("IIBA certification FAQ", "https://www.iiba.org/business-analysis-certifications/certification-faq")
CBAP = ("IIBA CBAP page", "https://www.iiba.org/business-analysis-certifications/cbap/")
FEES = ("IIBA certification fees", "https://www.iiba.org/business-analysis-certifications/certification-fees/")
SQL = ("PostgreSQL SQL introduction", "https://www.postgresql.org/docs/current/tutorial-sql-intro.html")
JIRA = ("Jira getting started", "https://www.atlassian.com/software/jira/guides/getting-started/introduction")
WCAG = ("WCAG 2.2 quick reference", "https://www.w3.org/WAI/WCAG22/quickref/")
FHIR = ("HL7 FHIR overview", "https://www.hl7.org/fhir/overview.html")
SRE = ("Google SRE book introduction", "https://sre.google/sre-book/introduction/")
USCIS = ("USCIS, H-1B specialty occupations", "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations")

EXTRA_DIAGRAMS = [
    ("verify-validate", "Verify then validate", ["Verify the statement is clear", "Validate it is the right need", "Peer reads it", "Stakeholder confirms it"], "Both checks. One is not the other.", BABOK),
    ("priority", "Priority words", ["Must: legal or safety", "Should: the outcome depends on it", "Could: useful, not this release", "Won't: out of this scope"], "A study split. The DSDM page did not open, so it is not linked.", BABOK),
    ("accept", "Acceptance shape", ["Given a start state", "When an action happens", "Then an outcome is true", "And an exception is named"], "From the Gherkin reference.", GHERKIN),
    ("states", "Requirement states", ["Draft", "Confirmed", "Baselined", "Changed", "Retired"], "A state without an owner is a rumor.", BABOK),
    ("workshop", "Workshop roles", ["Facilitator", "Sponsor who can decide", "People who do the work", "Scribe", "Timebox"], "If the sponsor is absent, the result is a draft.", BABOK),
    ("interview", "Interview shape", ["Purpose", "Questions written first", "Notes sent back", "Reply edits the notes", "Open items listed"], "Unconfirmed notes are your memory.", BABOK),
    ("observe", "Observation", ["Tell people you are watching", "Watch the real queue", "Note skipped steps", "Ask why afterward", "Do not invent a policy"], "People skip steps they no longer notice.", BABOK),
    ("rules", "Rules beside flow", ["Policy lives once", "Process points at the rule", "A rule change does not redraw every box", "Owner is named"], "Keep decisions out of the arrows.", BABOK),
    ("nfr", "Quality with a number", ["Name the quality", "Name the measure", "Name the test", "Name the limit"], "Fast is not a requirement.", BABOK),
    ("scope", "Scope box", ["In", "Out", "Later", "Unknown"], "Unknown is allowed. Silent is not.", BABOK),
    ("options", "Options including stop", ["Do nothing", "Small change", "Buy", "Build", "Recommend or unknown"], "Do nothing is a real option.", BABOK),
    ("risk", "Risk card", ["Event", "Likelihood, qualitative", "Impact", "Response", "Owner"], "No made-up percentages.", BABOK),
    ("persona", "Persona card", ["Role, not a real name", "Goal", "Constraint", "What done looks like"], "A composite. Not a claim about a person you know.", BABOK),
    ("journey", "Journey lanes", ["Stage", "What the person does", "What they need", "Where it breaks"], "One journey. One service.", BABOK),
    ("context", "Context diagram", ["The system in the middle", "People and systems around it", "Named flows between them", "No internal boxes yet"], "Stop at the boundary the audience needs.", C4),
    ("uml-set", "UML sketches", ["Class: things and links", "Sequence: who calls whom", "State: allowed changes", "Activity: work steps"], "The about-page names the language. These are study uses.", ("OMG UML 2.5.1", "https://www.omg.org/spec/UML/2.5.1/About-UML")),
    ("gateway", "Gateway habits", ["One question on the diamond", "Every path labeled", "A default path exists", "Join is explicit"], "An unlabeled path is an argument waiting.", BPMN),
    ("happy-sad", "Two paths", ["Happy path reaches the goal", "One exception is drawn", "The exception has an end", "Both are confirmed"], "The unhappy path is where acceptance hides.", BPMN),
    ("backlog", "Backlog order", ["Outcome at the top", "Ready items are clear", "Not-ready items stay below", "Order is a decision"], "The Scrum Guide describes a product backlog as ordered.", SCRUM),
    ("increment", "Increment", ["Usable", "Meets the sprint goal slice", "Inspected at review", "Not a hidden branch"], "An increment is a concrete step.", SCRUM),
    ("roles-scrum", "Three accountabilities", ["Developers", "Product Owner", "Scrum Master", "One team"], "Names from the 2020 Scrum Guide.", SCRUM),
    ("kanban-board", "Board with a limit", ["Options", "Ready", "Doing, limited", "Done"], "A board with no limit is a list.", ("Miro Kanban", "https://miro.com/kanban/")),
    ("sprint-kit", "Design sprint days", ["Understand", "Sketch", "Decide", "Prototype", "Test"], "This is the design-sprint shape, not a Scrum sprint.", ("Google Design Sprint Kit", "https://designsprintkit.withgoogle.com/")),
    ("forces", "Switch forces", ["Push of the current pain", "Pull of the new way", "Habit that holds", "Anxiety about the new"], "A job story names the circumstance.", JTBD),
    ("double-diamond", "Learn then choose", ["Diverge on the problem", "Converge on the need", "Diverge on options", "Converge on a test"], "IDEO is the public pointer. The drawing is ours.", IDEO),
    ("kpi-card", "KPI card", ["Question", "Formula", "Source system", "Owner", "When you act"], "A chart without an owner waits.", HEART),
    ("sql-path", "One SQL question", ["Which rows", "Which columns", "Which groups", "Which filter"], "The PostgreSQL tutorial introduces these ideas.", SQL),
    ("event-log", "Event log fields", ["Case id", "Activity", "Timestamp", "Who, if allowed"], "Process mining reads logs. Permission comes first.", ("IEEE Task Force on Process Mining", "https://www.tf-pm.org/")),
    ("jira-flow", "Ticket hygiene", ["One outcome", "Acceptance on the ticket", "Link to the source", "Status matches the truth"], "The tool stores the decision. It does not make it.", JIRA),
    ("conf-page", "Decision page", ["Question", "Options", "Decision", "Date and owner"], "Write the decision where the team will look.", ("Confluence", "https://www.atlassian.com/software/confluence")),
    ("ai-check", "Draft checklist", ["Source attached", "Every fact checked", "Unknowns marked", "A person accepts"], "Fluent is not sourced.", BABOK),
    ("prompt", "Prompt parts", ["Role of the reader", "Source you may use", "Output shape", "What not to invent"], "A prompt is not a requirement.", BABOK),
    ("handoff", "Human handoff", ["Model may draft", "Person speaks to the customer", "Escalation is specified", "The transcript is not the requirement"], "The handoff is a requirement.", SRE),
    ("fhir-lens", "Healthcare lens", ["Whose record", "Which system may see it", "What you will not guess", "A public spec for interoperability"], "FHIR is the opened overview. Local policy still rules.", FHIR),
    ("a11y", "Accessibility checks", ["Name the control", "Keyboard path", "Contrast", "Error text"], "WCAG 2.2 is the public quick reference.", WCAG),
    ("vendor", "Same questions", ["Criteria weighted first", "Same script for each bidder", "Evidence, not charm", "Why the others lost"], "Score after the demo, using the weights you set before.", BABOK),
    ("change-ctrl", "Change record", ["What moved", "Traces touched", "Decision", "New baseline"], "A hallway yes is not a record.", BABOK),
    ("release", "Release note", ["What a person can now do", "What is still out", "How to tell it failed", "Who to call"], "A release note is a promise you can check.", BABOK),
    ("retro", "Retro prompts", ["What helped the analysis", "What we skipped confirming", "One change to the way of working"], "A retrospective is about the work system.", SCRUM),
    ("star", "STAR card", ["Situation, generic", "Task you owned", "Action you took", "Result you can show"], "Practice answers use a made-up team. They are not a biography.", FAQ),
]

EXTRA_FLOWS = [
    ("scope-flow", "Draw the boundary", ["Write the outcome", "List in and out", "Mark unknowns", "Ask the sponsor to confirm", "Store the paragraph"], "Scope is a paragraph with an owner.", BABOK),
    ("workshop-flow", "Run a workshop", ["Send the purpose", "Check the decision maker can attend", "Timebox each question", "Read back decisions", "Send notes the same day"], "Absent decision maker means draft.", BABOK),
    ("model-flow", "From talk to picture", ["Pick the question", "Pick one notation", "Draw the unhappy path", "Read it aloud", "Change the picture, not the memory"], "One question per drawing.", BPMN),
    ("priority-flow", "Triage a list", ["Name the release goal", "Mark legal and safety first", "Mark the rest as later or never", "Say why", "Revisit when the goal changes"], "Priority without a goal is taste.", BABOK),
    ("rule-flow", "Separate a rule", ["Find a decision inside a step", "Write it as a rule", "Point the step at the rule", "Name the owner", "Leave the flow thinner"], "Policy changes should not redraw the map.", BABOK),
    ("data-flow", "Name the data", ["Which thing", "Which fields", "What blank means", "Who may see it", "Where it is mastered"], "Two teams, one column, two meanings. Stop that.", BABOK),
    ("sql-flow", "Ask with a query", ["Write the question in words", "Then the filter", "Then the grouping", "Check a row by hand", "Do not publish a number you cannot source"], "The tutorial is the citation. The query is yours.", SQL),
    ("retro-flow", "Improve the analysis", ["What we confirmed late", "What we drew too soon", "One experiment next time", "Owner for that experiment"], "A retro with no experiment is a complaint.", SCRUM),
    ("story-split", "Split a story", ["Find two outcomes", "Give each its own Then", "Drop technical layers as stories", "Keep the thin slice releasable"], "A slice is an outcome.", STORIES),
    ("nfr-flow", "Make quality testable", ["Pick one quality", "Write the measure", "Write the test setup", "Agree the fail line"], "Without a fail line, the argument returns.", BABOK),
    ("a11y-flow", "Check a screen", ["Keyboard only", "Names on controls", "Contrast of text", "Error that says how to fix"], "The quick reference is the public pointer.", WCAG),
    ("vendor-demo", "Sit a demo", ["Weights are already set", "Same tasks for each vendor", "Score from evidence", "Write why others lost"], "Charm is not a criterion.", BABOK),
    ("release-flow", "Accept a release", ["Criteria already exist", "Try the unhappy path", "Classify gaps", "Record the decision"], "The first viewing is not acceptance.", BABOK),
    ("persona-flow", "Make a composite", ["Group similar goals", "Drop real names", "Name a constraint", "Check with someone who does the work"], "A persona is a hypothesis.", BABOK),
    ("journey-flow", "Walk the service", ["Stage by stage", "What the person does", "Where they wait", "Which wait is a requirement"], "Waiting is data.", BABOK),
    ("handoff-flow", "Specify the handoff", ["What the model may say", "When a person must join", "What data is on screen", "How you will know it failed"], "The handoff is testable.", SRE),
    ("fhir-flow", "Healthcare question", ["Which record", "Which system", "What you will not guess", "Which public spec applies", "Local policy still wins"], "Overview only. Not a hospital's rule.", FHIR),
    ("star-flow", "Practice an interview", ["Pick a generic situation", "Name your task", "Name your action", "Name a result you could show", "Do not invent an employer"], "Generic practice. Not a resume.", FAQ),
]

STUDY = {
    "foundations": {
        "five": "Business analysis names a need and a change that has value for a named stakeholder. The public BABOK hub describes a core concept model: change, need, solution, stakeholder, value, and context. A tool name is a solution hypothesis. Write the need in a sentence that still makes sense if the tool changes. Say who decides.",
        "visual": "baccm",
        "exampleTitle": "Worked example: a clinic callback",
        "example": [
            "A generic clinic wants fewer missed lab results. The need is: patients with an abnormal result hear from the clinic the same day. The phone system is a solution idea, not the need.",
            "Stakeholders: the nurse who calls, the patient, the lab, and the medical director who can approve a new step. Value for the patient is timely news. Value for the clinic is a closed loop. Context includes the hours the lab is open.",
        ],
    },
    "ecosystem": {
        "five": "The same techniques show up in product ownership, project delivery, data work, and change. Shared techniques do not mean shared authority. Ask who decides the need, who decides the date, and who accepts the result. This lab uses the BABOK hub as the core public map and cites neighbors only where a page opened.",
        "visual": "ecosystem",
        "exampleTitle": "Worked example: three roles, one change",
        "example": [
            "A generic retailer wants a clearer return. The analyst writes the need and the acceptance checks. A project manager sequences the work. A product owner orders the backlog.",
            "If one person holds two of those, write that down. Hidden decision rights cause the meeting after the meeting.",
        ],
    },
    "babok": {
        "five": "The public contents list six knowledge areas: planning the analysis, elicitation and collaboration, life cycle management, strategy analysis, requirements analysis and design definition, and solution evaluation. Under them sits a long technique list. Learn the question each technique answers. Verification asks if a requirement is fit to use. Validation asks if it is the right one.",
        "visual": "areas",
        "exampleTitle": "Worked example: evaluation after go-live",
        "example": [
            "A generic warehouse releases a pick screen. Evaluation does not stop at launch. Measure mis-picks, ask pickers where the screen slows them, and recommend a change.",
            "The CBAP page makes the same point in its public sample material: limitation assessment happens when a solution is in use in some form.",
        ],
    },
    "requirements": {
        "five": "A requirement is a usable representation of a need. Give it an identifier, a source, an owner, and a test. A user story names a role, a capability, and an outcome. Given, When, and Then, from the Gherkin reference, turn the outcome into a scenario. Trace the scenario to a test. Untraced text is a rumor.",
        "visual": "trace",
        "exampleTitle": "Worked example: one story",
        "example": [
            "As a returns clerk, I want to see why an item was returned, so that I can offer the right next step.",
            "Given a scanned item with a reason code, when the clerk opens the return, then the reason and the allowed next steps are on screen. Unhappy path: the code is missing, and the clerk must capture it before finishing.",
        ],
    },
    "modeling": {
        "five": "Pick the question before the notation. BPMN is for flow: events, activities, gateways. UML is a family of sketches. An ERD names things and relationships. C4 steps from system context to container, component, and code. Stop at the level the audience can use. Draw the unhappy path.",
        "visual": "bpmn",
        "exampleTitle": "Worked example: a gateway",
        "example": [
            "Start: a return arrives. Activity: look up the order. Gateway: is the item within the stated window? Yes path: refund. No path: explain the window and stop.",
            "Both paths have an end. The window length is a business rule beside the drawing, so a policy change does not redraw the map.",
        ],
    },
    "agile": {
        "five": "The 2020 Scrum Guide names three accountabilities and five events, plus the product backlog, sprint backlog, and increment. A kanban board shows flow and limits work in progress. A design sprint is a different sequence: understand, sketch, decide, prototype, test. Do not mix those calendars. Course prices that did not render stay unknown.",
        "visual": "sprint",
        "exampleTitle": "Worked example: ready for planning",
        "example": [
            "A generic backlog item is ready when the outcome, the acceptance scenario, and the out-of-scope line are written. It is not ready when it only names a screen.",
            "Planning then chooses a slice that can be inspected at review. The review looks at the increment, not at a slide of intentions.",
        ],
    },
    "data": {
        "five": "A measure needs a question, a formula, a source, and an owner. HEART, from the cited Google Research paper, is a set of user-centered categories, not a benchmark. SQL, as the PostgreSQL tutorial introduces it, filters and groups rows. Process mining reconstructs paths from event logs you are allowed to use. Leave unknown numbers blank.",
        "visual": "heart",
        "exampleTitle": "Worked example: one KPI",
        "example": [
            "Question: are same-day callbacks happening? Formula: abnormal results called the same calendar day, divided by abnormal results received that day. Source: the call log plus the lab file. Owner: the nurse lead. Act when the rate drops under the line the clinic sets.",
            "This lab does not invent the line. The clinic does.",
        ],
    },
    "tools": {
        "five": "Jira, Confluence, Visio, Miro, Lucid, and Figma are places teams keep work. The decision still lives in a sentence a person can accept. Put the outcome and the test on the ticket. Put the decision, the date, and the owner on the page. A polished board with no limit is still a list.",
        "visual": "jira-flow",
        "exampleTitle": "Worked example: a ticket",
        "example": [
            "Title: show the return reason. Description: the story and one Given-When-Then. Link: the business need identifier. Status moves to done only when that scenario passes.",
            "The screenshot in the ticket is an illustration. The scenario is the requirement.",
        ],
    },
    "ai": {
        "five": "A model can draft a list, a scenario, or a first drawing. A person checks every fact against a source, marks unknowns, and accepts the text before a stakeholder sees it as a requirement. The handoff from a model to a person, in a contact center or a product flow, is itself a requirement. This lab claims no tool expertise for anyone.",
        "visual": "ai",
        "exampleTitle": "Worked example: a rejected draft",
        "example": [
            "A model drafts: refunds are always instant. The policy you were given says refunds over a stated amount need a lead. You strike the word always, attach the policy, and mark the threshold as confirmed.",
            "The fluent sentence was not the requirement. The corrected sentence is.",
        ],
    },
    "domains": {
        "five": "The moves stay the same: need, stakeholder, rule, test. The constraints change. Healthcare interoperability has a public overview in HL7 FHIR. Banking, insurance, retail, telecom, and contact centers add their own rules. If a rule was not on a page this lab opened, it is not stated as fact.",
        "visual": "domains",
        "exampleTitle": "Worked example: two domains, one move",
        "example": [
            "A contact reason and a clinical result both need a source, an owner, and a handoff. In the clinic, you do not guess the record rules. In the contact center, you do not guess the retention rules.",
            "Write the constraint as unknown until someone who owns it confirms it.",
        ],
    },
    "product": {
        "five": "Discovery restates the job before the feature. A business case lists options, including do nothing, and only the costs and benefits you can source. Change work names awareness, desire, knowledge, ability, and reinforcement, the words on the Prosci page. Vendor choice weights the criteria before the demos.",
        "visual": "case",
        "exampleTitle": "Worked example: a thin case",
        "example": [
            "Need: same-day notice of abnormal results. Options: do nothing, a checklist on paper, a work-queue screen. Costs you can source: staff time for the paper checklist. Benefits you can source: none yet, so the cell stays blank.",
            "Recommendation: pilot the checklist for two weeks and measure. Unknown is a permitted recommendation.",
        ],
    },
    "certs": {
        "five": "Read the fee cell and the eligibility FAQ before you pay. ECBA, CCBA, CBAP, AAC, and CBDA figures in this lab were copied from IIBA pages on 16 October 2026, including member and non-member lines as printed. PMI-PBA experience paths and the exam shape are cited. The exam fee was not on the page that loaded. Scrum.org and the SAFe POPM course page did not yield a fee. Confirm before you pay. This lab states no salaries.",
        "visual": "career",
        "exampleTitle": "Worked example: choosing what to read",
        "example": [
            "If you are new, read the ECBA eligibility line on the FAQ before you read a price. If you are experienced, read the CBAP hour rules and the blueprint, then the fee cell.",
            "A study plan can start before you pay. Paying is optional and external to this lab.",
        ],
    },
    "home": {
        "five": "Start here if you have an hour. The banner is one row. The menu at the top left holds the rooms, text size, theme, text color, and search. Voice stays off until you ask. Fees are dated. Unknowns stay unknown.",
        "visual": "baccm",
        "exampleTitle": "How a visit goes",
        "example": ["Read the five-minute block in a room, look at the drawing, then the worked example, then try the short quiz.", "Downloads at the bottom of the downloads room keep the same disclaimer as the footer."],
    },
    "start": {
        "five": "The one-hour path is eight short stops: display, need and roles, six knowledge areas, one testable requirement, one picture, one delivery frame, one measure, then credentials and practice. Skip the long rooms until the path is done.",
        "visual": "trace",
        "exampleTitle": "A first hour",
        "example": ["Spend the first six minutes on the core concept model. Spend the middle on one story with Given, When, and Then. End by reading one fee cell and marking anything unmarked as to be confirmed."],
    },
    "practice": {
        "five": "Cards, a quiz, a sort, a match, a stakeholder interview, a triage, and a BPMN order game. Scores stay in this browser. Questions were written for this lab. They are not retired exam items.",
        "visual": "accept",
        "exampleTitle": "How to practice",
        "example": ["Flip ten cards. Then take the quiz. Then place four triage items. The point is the habit, not a score to publish."],
    },
    "diagrams": {
        "five": "Each drawing answers one question. Read the caption and the source. Download the SVG, the PNG, or a standalone HTML page that keeps the color and the disclaimer.",
        "visual": "bpmn",
        "exampleTitle": "Read a drawing",
        "example": ["Cover the caption. Say what question the boxes answer. If you cannot, the drawing is too vague for the room you are in."],
    },
    "flows": {
        "five": "A flow is an ordered sequence, not a project plan. The dot moves when motion is allowed. On a phone, or with reduced motion, it stays still. The order of the steps is the lesson.",
        "visual": "trace",
        "exampleTitle": "Confirmation is a step",
        "example": ["Prepare, talk, send notes, edit from the reply, then baseline. Skipping the reply makes the notes yours alone."],
    },
    "charts": {
        "five": "Bars are blueprint percentages from pages that opened, or counts of files in this lab. They are not market statistics and not salaries.",
        "visual": "career",
        "exampleTitle": "Read a bar",
        "example": ["The CBAP analysis-and-design bar is the largest on that chart because the cited page says 30 percent. The lab count bars are how many notes this repository holds."],
    },
    "glossary": {
        "five": "Each term has a short meaning and a source. Filter the list. If a definition disagrees with the standard you are reading, trust the standard and tell us through the contact form.",
        "visual": "classes",
        "exampleTitle": "Requirement versus design",
        "example": ["A requirement states a condition. A design describes a solution. Say which reading you intend so a reviewer knows."],
    },
    "resources": {
        "five": "Every link in the table was requested in the October 2026 check. A page that did not open is omitted, and the related note says what is still to be confirmed.",
        "visual": "scope",
        "exampleTitle": "What is not here",
        "example": ["Scrum.org assessment pages, the SAFe POPM course page, and Kanban University course fees did not render. They are not linked and no price is invented."],
    },
    "templates": {
        "five": "Copy an outline into your own notes. Leave unknown lines blank. The files are study scaffolds, not a company's form.",
        "visual": "rtm",
        "exampleTitle": "A thin BRD",
        "example": ["One paragraph for the problem, the decision maker, the measure, what is out, and a recommendation or the word unknown."],
    },
    "downloads": {
        "five": "Take an SVG, a PNG, or a standalone HTML diagram. Take cheat sheets as PDF, HTML, and PNG. Take flashcards as PDF, JSON, and HTML. Templates come as DOCX, PDF, and HTML. The deck is PPTX. One zip gathers the files after the images are rendered.",
        "visual": "rtm",
        "exampleTitle": "Check a file",
        "example": ["Open a diagram HTML page on its own. The drawing, the caption, and the disclaimer box should all be there without the rest of the lab."],
    },
    "search": {
        "five": "Search looks through notes and glossary meanings in this browser. It does not call a server.",
        "visual": "states",
        "exampleTitle": "Try a word",
        "example": ["Search for traceability, gateway, or ECBA. Open the note. The source line is the page that was checked."],
    },
    "credits": {
        "five": "The notes, drawings, and the guide monkey are original. Browser speech is the platform voice. three.js is not shipped, so a phone does not download a 3D engine. No pre-recorded clips were made, because no open local speech engine was on the build machine.",
        "visual": "ai-check",
        "exampleTitle": "What to trust",
        "example": ["Trust a sentence that has a source line. Treat a to-be-confirmed line as unknown. Correct us through the contact form."],
    },
    "careers": {
        "five": "Show a traced requirement, a confirmed model, and a measure with an owner. Practice STAR with a generic story, never a borrowed biography. Pay is not discussed here. Sponsorship is an employer decision and a legal question. The USCIS H-1B page opened for a high-level description of specialty occupations. It is not advice, and this lab promises no visa.",
        "visual": "star",
        "exampleTitle": "Worked example: a generic STAR",
        "example": [
            "Situation: a generic city clinic had no written rule for abnormal-result calls. Task: you were asked to make the rule testable. Action: you interviewed two nurses, wrote one story and one unhappy path, and traced it to a checklist. Result: the pilot checklist was used for two weeks and the open questions were listed.",
            "That story is invented for practice. It is not Lucky's career and not a claim of employment.",
        ],
    },
}

GAMES = {
    "match": [
        ["RTM", "A table that links needs, requirements, and tests"],
        ["Gateway", "A BPMN split or join"],
        ["Increment", "A concrete Scrum step you can inspect"],
        ["HEART", "Happiness, engagement, adoption, retention, task success"],
        ["ADKAR", "Awareness, desire, knowledge, ability, reinforcement"],
    ],
    "interview": [
        {
            "ask": "Tell me about a requirement you made testable.",
            "better": "Use a generic situation, name the task you owned, the scenario you wrote, and a result you could point at. Leave employers unnamed.",
            "weaker": "I always write perfect requirements and the business loved me.",
        },
        {
            "ask": "How do you handle a stakeholder who wants a tool, not an outcome?",
            "better": "Restate the outcome that would still matter if the tool changed. Write both the request and the need. Ask who decides.",
            "weaker": "I put the tool name in the ticket and start building.",
        },
    ],
    "triage": [
        ["A retention rule the lawyer already issued", "Now"],
        ["The callback outcome the sponsor asked to pilot", "Now"],
        ["A second chart that repeats the same number", "Later"],
        ["A rewrite of an unrelated billing engine", "Drop"],
    ],
    "bpmn": ["Start event", "Look up the order", "Within the window?", "Refund", "Explain and stop"],
}

INTERVIEWS = [
    {
        "q": "Describe a time you traced a need to a test.",
        "star": "Situation: a generic returns desk argued about refunds. Task: make one rule testable. Action: write the story, one Given-When-Then, and a link to the policy paragraph. Result: the unhappy path, a missing reason code, was added before anyone called it done.",
    },
    {
        "q": "Describe a time you stopped a solution from running ahead of the need.",
        "star": "Situation: a generic team wanted a new dashboard. Task: name the decision the chart would change. Action: ask for the question, the source, and the owner. Result: the chart waited until those three existed. No tool was purchased in the story.",
    },
    {
        "q": "Describe a workshop that did not decide.",
        "star": "Situation: the sponsor missed a generic prioritization workshop. Task: keep the team from treating drafts as decisions. Action: label every item draft and send notes the same day. Result: the sponsor confirmed two items and rejected one in writing.",
    },
]


def extra_quizzes():
    src = "2026-10"

    def q(section, question, choices, answer, why, source):
        return {
            "q": question,
            "choices": choices,
            "answer": answer,
            "why": why,
            "source": source[0],
            "url": source[1],
            "asOf": src,
            "section": section,
        }

    return [
        q("foundations", "A tool name in a requirement is best treated as:",
          ["The need itself", "A solution hypothesis", "A salary", "A certification"], 1,
          "The need should still make sense if the tool changes.", BABOK),
        q("ecosystem", "Shared techniques across roles mean:",
          ["Shared authority", "You still name who decides", "The project manager owns the need", "No one owns the test"], 1,
          "Technique overlap is not decision overlap.", SCRUM),
        q("babok", "Validation asks whether a requirement is:",
          ["Spelled correctly only", "The right requirement", "A theme color", "A fee"], 1,
          "Verification asks whether it is fit to use. Validation asks whether it is the right one.", BABOK),
        q("requirements", "Given, When, and Then are how you:",
          ["Hide a gap", "Write a scenario", "Set a salary", "Skip the source"], 1,
          "The Gherkin reference uses those words.", GHERKIN),
        q("modeling", "An unlabeled BPMN path is:",
          ["A finished decision", "An argument waiting", "A C4 container", "A fee cell"], 1,
          "Every gateway path needs a label.", BPMN),
        q("agile", "The 2020 Scrum Guide's artifacts include:",
          ["Only a Gantt chart", "Product Backlog, Sprint Backlog, and Increment", "A pay band", "A vendor score"], 1,
          "Those three are in the guide.", SCRUM),
        q("data", "A KPI without an owner is:",
          ["Ready to publish", "Incomplete", "A HEART benchmark", "A SQL join"], 1,
          "Name the question, formula, source, and owner.", HEART),
        q("tools", "A ticket is done when:",
          ["The screenshot looks finished", "The agreed scenario passes", "The board is colorful", "A model said so"], 1,
          "The tool stores the decision. The scenario is the test.", JIRA),
        q("ai", "Who accepts a model draft as a requirement?",
          ["The model", "A person who checked it", "Nobody", "The theme picker"], 1,
          "Unreviewed model text is not a requirement.", BABOK),
        q("domains", "When a domain rule was not on an opened page, you:",
          ["Invent a plausible law", "Leave it unknown", "Copy a blog", "Use a salary survey"], 1,
          "Constraints are cited only where a page opened.", FHIR),
        q("product", "A business case may recommend:",
          ["Only build", "Unknown, if the numbers are not sourced", "A salary", "Skipping options"], 1,
          "Blank cells stay blank. Do nothing is an option.", BABOK),
        q("certs", "Before you pay an IIBA fee you should:",
          ["Trust a memory of the price", "Read the current fee page", "Skip eligibility", "Assume a salary return"], 1,
          "Prices change. The lab copies a dated cell and says confirm.", FEES),
        q("careers", "A STAR practice answer in this lab is:",
          ["Lucky's employment history", "A generic story with no employer claim", "A pay demand", "A visa promise"], 1,
          "Practice stories are invented. Sponsorship is not promised.", USCIS),
    ]

"""Contact-center rooms. Every claim is tied to a page opened in October 2026."""

AS_OF = "2026-10"

NNG = ("NN/g, Journey Mapping 101", "https://www.nngroup.com/articles/journey-mapping-101/")
FEATURE = ("Connect Customer feature overview", "https://docs.aws.amazon.com/connect/latest/adminguide/connect-feature-overview.html")
WHATSAPP = ("Connect Customer, Set up WhatsApp Business messaging", "https://docs.aws.amazon.com/connect/latest/adminguide/whatsapp-integration.html")
METRICS = ("Connect Customer metric definitions", "https://docs.aws.amazon.com/connect/latest/adminguide/metrics-definitions.html")
IBM = ("IBM, What is CSAT and how to calculate it", "https://www.ibm.com/think/topics/csat-customer-satisfaction-score")
WORK = ("AWS Prescriptive Guidance, project phases and workstreams", "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration-connect/workstreams.html")
JOURNEY = ("AWS Prescriptive Guidance, user journeys workstream", "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration-connect/user-journeys.html")
OPS = ("AWS Prescriptive Guidance, operational workstream", "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration-connect/operational.html")
CHECK = ("AWS Prescriptive Guidance, migration checklists", "https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-migration-connect/checklist.html")


def note(nid, section, level, title, summary, source, points=None, tbd=""):
    return {
        "id": nid,
        "section": section,
        "level": level,
        "title": title,
        "summary": summary,
        "points": points or [],
        "source": source[0],
        "url": source[1],
        "asOf": AS_OF,
        "tbd": tbd,
    }


def cc_notes():
    return [
        note("om-map", "omni", "foundation", "What a journey map is",
             "Nielsen Norman Group's Journey Mapping 101, last reviewed on that site in July 2026 and opened for this lab in October 2026, defines a journey map as a visualization of the process that a person goes through in order to accomplish a goal. The page says mapping starts from a series of user actions on a timeline, then adds thoughts and emotions to make a narrative, then condenses that narrative into a visualization.",
             NNG),
        note("om-parts", "omni", "foundation", "Five elements on the map",
             "The same article says journey maps share five elements: the actor, the scenario and expectations, the journey phases, the actions mindsets and emotions, and the opportunities. Opportunities, with ownership and metrics, are how the team decides what to change and how an improvement will be measured.",
             NNG, [
                 "Actor: the point of view. The article says to provide one point of view per map.",
                 "Scenario and expectations: the situation, the goal, and what the person expects. A scenario can be current or anticipated.",
                 "Phases: high-level stages that organize the rest. The article's support-shaped example is discover, try, buy, use, seek support.",
                 "Actions are the narrative of what the person does, not every click. Mindsets are thoughts and questions. Emotions are the ups and downs.",
                 "Opportunities ask what to do with the knowledge, who owns the change, and how improvement will be measured.",
             ]),
        note("om-cousins", "omni", "intermediate", "Map, blueprint, and story map",
             "The article separates three pictures that teams mix up. An experience map is broader: a generic human experience, not one product. A service blueprint takes the business view of a specific journey and shows how the organization supports the touchpoints. A user-story map breaks a feature into release slices. The article says journey maps are for discovery and understanding, and user-story maps are for planning and implementation.",
             NNG),
        note("om-channels", "omni", "foundation", "Channels a platform page lists",
             "The Connect Customer feature overview, opened in October 2026, lists voice, chat and SMS, web calling and video, tasks, and email. It says customers choose a channel from preference and wait time, can stay with the same agent across channels, and if the agent changes the interaction history is preserved so they do not have to repeat themselves. This lab cites that page. It does not rank vendors.",
             FEATURE, [
                 "Voice uses the softphone in the browser. The page describes 16 kHz audio.",
                 "Text channels on that page include web chat, mobile chat, SMS, and third-party messaging apps.",
                 "Tasks cover follow-up work such as messages, training, and research, routed like other contacts.",
                 "Email can arrive at a business address or from a web form. The page says email uses Amazon Simple Email Service, up to five custom domains, and up to 100 addresses.",
             ]),
        note("om-text", "omni", "intermediate", "Chat, SMS, and messaging apps",
             "The feature overview groups web chat, mobile chat, SMS, and third-party messaging apps. It names WhatsApp and Facebook Messenger as examples of those apps. It says a chatbot can run first, and if a person is needed the agent receives the prior self-service context. This check did not open a separate Facebook Messenger setup article, so Messenger setup steps are not written here.",
             FEATURE),
        note("om-wa", "omni", "intermediate", "WhatsApp as a requirement, not a logo",
             "The Connect Customer WhatsApp setup page says you link a WhatsApp Business Account and phone number through AWS End User Messaging Social, import the number, and attach an inbound contact flow. The number must be able to receive a voice call or an SMS so Meta can complete verification. The page says automated business verification can take up to 2 weeks, and that WhatsApp can disable an account if policy is violated or the business identity cannot be verified. It recommends a new number that is not already carrying live voice or SMS traffic.",
             WHATSAPP, [
                 "Test before live traffic: set the agent to Available in the Contact Control Panel and send a WhatsApp message from a phone.",
                 "A flow can branch on the segment attribute Subtype equal to connect:WhatsApp.",
                 "The page says customers can resume a chat with context, metadata, and the transcript carried forward.",
                 "Quotas called out for go-live include concurrent active chats, StartChatContact, and the WhatsApp send APIs. This lab does not copy quota numbers.",
             ]),
        note("om-social", "omni", "advanced", "Social is still a contact",
             "Treat a social or messaging conversation as a contact with a channel, a queue, and a record, not as a post you only read. The feature overview says agents use the same tools for SMS that they use for calls and chats, and that messaging can start in self-service before a person joins. Write which public account is in scope. A channel you have not confirmed is out of scope until someone names it.",
             FEATURE),
        note("om-req", "omni", "advanced", "Requirements the map should force",
             "The journey article says the useful end of a map is an opportunity with an owner and a way to measure the improvement. For a contact-center project, write these as requirements: the actor and the scenario, the channels in scope, the context that must travel with the person, the moment a bot hands to a person, and the measure you will read after the change. The feature overview says agents should not make the customer start again when the agent changes.",
             NNG, [
                 "One map, one actor. A second persona is a second map.",
                 "Name the data on screen at the start of the contact. The feature overview's Customer Profiles section says profiles can combine contact history with CRM products it names: Salesforce, Zendesk, ServiceNow, or another CRM.",
                 "A vendor name is a solution hypothesis. The need is still the person's goal.",
             ]),
        note("om-blue", "omni", "advanced", "Blueprint under the journey",
             "After the journey is stable enough to argue about, the Nielsen Norman article points to a service blueprint: the same journey, drawn from the organization's side. In a contact center that means the flow, the queue, the person or bot who acts, and the system that must answer. The user-journeys migration page says mapping experiences and recording prompts belongs with business stakeholders and service-line owners, not only with the technical foundation team.",
             NNG),
        note("kpi-frame", "metrics", "foundation", "Whose definition you are using",
             "The formulas in this room are copied from the Connect Customer metric-definitions page and, for CSAT, from IBM's CSAT page, both opened in October 2026. They are not a universal contact-center standard. A legacy report can use the same name and a different fraction. Write the definition beside the number before you compare platforms.",
             METRICS),
        note("kpi-aht", "metrics", "foundation", "Average handle time",
             "The metric-definitions page says average handle time is the average time, from start to finish, that a contact is connected with an agent. It includes talk time, hold time, after-contact work, and agent pause duration. Pause applies only to tasks. The metric applies to inbound and outbound calls. For each contact record the page adds agent interaction, customer hold, after-contact work, and agent pause when those fields are present. If all four fields are null, that record is skipped. The average is the sum of the included records divided by how many records were not skipped.",
             METRICS, [
                 "Sample arithmetic only, not a real center. Record A: 120 seconds of interaction, 30 of hold, 60 of after-contact work, 0 pause. Total 210 seconds.",
                 "Record B: 90 + 0 + 30 + 0 = 120 seconds. Neither record is skipped.",
                 "Average handle time = (210 + 120) / 2 = 165 seconds.",
             ]),
        note("kpi-aht-pit", "metrics", "intermediate", "Handle-time pitfalls",
             "After-contact work is inside this definition, so a timer that stops when the customer hangs up is a different metric. The page says pause duration applies only to tasks, so a voice comparison that adds pause is not what this page describes. The page also publishes a separate average active time that includes interaction, hold, and after-contact work, including time in a custom status. Do not label that number AHT unless you checked the name on the report.",
             METRICS),
        note("kpi-sl", "metrics", "foundation", "Service level X",
             "Service level X on the metric-definitions page is the percentage of contacts removed from the queue between 0 and X seconds after being added. A contact is removed when an agent answers, the customer abandons, or the customer requests a callback. The printed calculation is (contacts removed from queue in X seconds / contacts queued) x 100. Preset values for X, in seconds, are 15, 20, 25, 30, 45, 60, 90, 120, 180, 240, 300, and 600. The page says a custom service level lives only on the report where you created it, up to 7 days, and up to 10 custom levels per report.",
             METRICS, [
                 "Sample only. 100 contacts queued. Within 30 seconds: 60 answered, 10 abandoned, 5 requested a callback. Removed = 75.",
                 "Service level 30 = 75 / 100 x 100 = 75 percent.",
                 "Answered-only would be 60 percent. That is a different formula. Say which one the project uses.",
             ]),
        note("kpi-sl-pit", "metrics", "advanced", "Service-level pitfalls",
             "Because abandonment and callback requests count as removal, a fast hang-up can raise this service level. Teams that mean 'answered inside X' must say so, and they must not paste this platform's service level into that sentence. The page also says the maximum custom duration is 7 days because a contact cannot last longer than 7 days on this platform. Another platform's limit is not copied here.",
             METRICS),
        note("kpi-abn", "metrics", "foundation", "Abandonment rate",
             "The metric-definitions page says abandonment rate is the percentage of abandoned contacts. An abandoned contact was disconnected by the customer while in queue, so the customer was not connected to an agent. Contacts queued for callback are not counted as abandoned. The printed calculation is (contacts abandoned / contacts queues) x 100. The minimum is 0 percent and the maximum is 100 percent.",
             METRICS, [
                 "Sample only. 100 contacts queued, 8 abandoned in queue, and 4 waiting for a callback. The 4 are not abandoned under this page.",
                 "Abandonment rate = 8 / 100 x 100 = 8 percent.",
             ]),
        note("kpi-abn-pit", "metrics", "intermediate", "Abandonment pitfalls",
             "The page says that when you group by routing profile, abandonment rate shows as 0, because an abandoned contact never reaches an agent and so has no routing profile. A routing profile is assigned when an agent accepts a contact. A dashboard sliced that way can hide the queue problem. Callbacks are also excluded, so a queue that offers callback can look calmer than the customer's wait.",
             METRICS),
        note("kpi-occ", "metrics", "foundation", "Occupancy",
             "Occupancy on the metric-definitions page is the percentage of time that agents were active on contacts. The page's steps are: get total contact time, get total contact and idle time, then calculate the percentage. The printed line is (contact time / contact time + idle time). Read with those steps, contact time is divided by contact time plus idle time. The minimum is 0 percent and the maximum is 100 percent. The page says data for this metric is available starting 1 October 2023 0:00:00 GMT.",
             METRICS, [
                 "Sample only. 40 minutes on contacts and 10 minutes idle.",
                 "Occupancy = 40 / (40 + 10) x 100 = 80 percent.",
             ]),
        note("kpi-occ-pit", "metrics", "advanced", "Occupancy and concurrency",
             "The page says occupancy does not account for concurrency. An agent is 100 percent occupied for an interval if they are handling at least one contact for that entire duration. An agent on one chat for the whole hour, with empty chat slots, is still fully occupied under this definition. Do not use it as proof that every slot was full.",
             METRICS),
        note("kpi-fcr", "metrics", "intermediate", "First contact, as this page counts it",
             "Cases resolved on first contact measures the percent of cases resolved on the first contact, and the page says that includes only calls, chats, or email. The case must be closed. The calculation returns true if there is exactly one of those contacts, otherwise false, and the page says the final percentage uses the average. A case that is reopened and then closed in the interval still counts. A case reopened but not closed in the interval does not. The page says this returns null if the case is not closed or has no contacts. SMS is not in the contact list on that calculation.",
             METRICS, [
                 "Sample only. Eight closed cases. Six have exactly one voice, chat, or email contact. Two have more than one.",
                 "Six true and two false. The average is 6 / 8 = 0.75, which is 75 percent.",
                 "An agent checkbox labeled resolved is a different measure until you show it matches this rule.",
             ]),
        note("kpi-csat", "metrics", "foundation", "CSAT",
             "IBM's CSAT page, opened in October 2026, says a customer satisfaction score indicates satisfaction with the company's product or services, focused on a specific interaction. It says you ask how satisfied the person was and offer a scale of 1 to 3, 1 to 5, or 1 to 10, or a percentage. The calculation it prints: add the positive responses (ratings of 4 or 5 out of 5, or 80 to 100 percent), divide by the total number of responses, then multiply by 100.",
             IBM, [
                 "Sample only. 40 responses. 30 are a 4 or a 5 on a 1 to 5 scale.",
                 "CSAT = 30 / 40 x 100 = 75 percent.",
                 "Say the scale and the count of responses next to the percent.",
             ]),
        note("kpi-csat-pit", "metrics", "advanced", "CSAT pitfalls",
             "The IBM page says CSAT does not give a full ongoing view of the long-term relationship. It describes Net Promoter Score as the recommend-to-a-friend question, and Customer Effort Score as how easy a task was. It does not print the arithmetic for those two, so this lab does not invent it. The page's own cons: a score can be skewed by events outside the contact, the survey may not say why, and people are more likely to answer after an exceptionally good or bad contact. The page also prints American Customer Satisfaction Index figures and calls them CSAT benchmarks, including banks 80 for 2024. This lab does not set those figures as a target.",
             IBM),
        note("kpi-golive", "metrics", "advanced", "What go-live day actually watches",
             "The migration checklist says that on go-live day you review real-time metrics and verify that calls are being answered, that abandonment rates and average handle times are as expected, and that queue depth remains sensible. The checklist does not print the expected numbers. The expected line is the organization's, or it is unknown. Write it down before the bridge opens.",
             CHECK),
        note("mg-words", "migrate", "foundation", "Sprint, workstream, and phase",
             "The AWS Prescriptive Guidance page on contact-center migration phases says a sprint is a time-bound collection of activities delivered by different workstreams, and gives two weeks as an example, not a rule for your project. A workstream is a team-bound set of activities. A phase is a goal-oriented collection across workstreams and ends at a milestone. The design phase, on that page, produces documents such as architectural diagrams, build specifications, and high-level designs, and it is done when the right stakeholders approve them.",
             WORK),
        note("mg-three", "migrate", "foundation", "Three workstreams",
             "The same page recommends at least three parallel workstreams: operational, technical foundation, and user journeys. It says mapping customer experiences and recording call prompts belongs on the user-journey workstream because those tasks need business stakeholders and service-line owners. Account and landing-zone work sits on the technical foundation. The page says the diagram has no specific timelines. Add the activities that fit, and estimate duration with the stakeholders.",
             WORK, [
                 "Sprint 0, as that page describes it, is kick-off, discovery, planning, and design.",
                 "The minimum lovable product is a small, stable slice. The page's example is a straightforward caller journey for a small group of agents.",
                 "Later sprints add capability after that slice is live.",
             ]),
        note("mg-discover", "migrate", "intermediate", "The journey workshop artifact",
             "The user-journeys page says discovery gathers existing flows or, if you are designing, runs a workshop. The canvas is a visual tool such as PowerPoint, Visio, or draw.io, or the contact-flow designer. You add blocks, decision points, and placeholders for steps still to confirm, and you name the owner of each placeholder. The page lists the attendees: project managers, business and solutions architects, business analysts, and the service-line owner and operator.",
             JOURNEY),
        note("mg-design", "migrate", "intermediate", "One picture that stays true",
             "The user-journeys page says design documentation is optional and depends on the size of the flow. If the team uses the contact-flow designer, the page says the journey is self-documented and is the build, which keeps a single source of truth. If you keep a separate design document, it must follow change control so it does not drift from the build.",
             JOURNEY),
        note("mg-test", "migrate", "intermediate", "Functional test, then acceptance",
             "The user-journeys page splits test into two steps in order. Functional testing happens across sprints as flows are created, by a functional test team. User acceptance testing happens only after functional tests pass, and it is performed by client business users, either a dedicated team or people from the service line. Flows go to production only after they pass that acceptance test.",
             JOURNEY),
        note("mg-cut", "migrate", "advanced", "Temporary number, cutover, rollback",
             "The deploy section says you claim a temporary phone number, assign the flows, and let the project team place test calls and run a selection of acceptance scripts. At go-live that number is replaced by the public number. Rollback, on that page, is swapping the number back to the legacy service line. The before-go-live checklist adds two planning items: toll-free repointing may need a provider ticket, and a porting request should be filed well before the date. This lab does not copy a lead time.",
             CHECK),
        note("mg-opmodel", "migrate", "foundation", "Operating model, not a runbook",
             "The operational workstream page says the operating model defines who will use the contact center and how it will be managed. It is not a procedure, a runbook, or a configuration file. The page's example: do not document how to pull logs. Document who pulls them and which queue or vendor receives them. The model includes a RASCI matrix (responsible, accountable, supported, consulted, and informed) and swimlanes for end-to-end activities, such as who can start an emergency queue message and what data they use. Stakeholders sign it before production, and the page says that sign-off is a go-live requirement.",
             OPS),
        note("mg-si", "migrate", "intermediate", "Service introduction and the change board",
             "Service introduction, on the operational page, puts the operating model into use. The page says the project must pass that team's checklists before go-live, including acceptance results, a check that no conflicting freeze or other go-live is on the same day, training completed, and operations ready. Engage that team early. The migration checklist says you submit a change request and get change-approval-board approval for a specific date and time. The checklist evidence is the input to that discussion.",
             OPS),
        note("mg-train", "migrate", "foundation", "Training is a migration artifact",
             "The operational page says the technology can work and the migration can still fail if users do not know how to answer contacts and do their daily tasks. It recommends training the trainer with in-house staff when that team exists, with project specialists supplying manuals and screen guides. If there is no training team, specialists train supervisors and lead support staff, who then train users. It also recommends instructor-led product training for system administrators and product owners. Course prices are not on that page, so this lab states none.",
             OPS),
        note("mg-check", "migrate", "advanced", "Checklist the analyst can trace",
             "The before-go-live checklist, opened in October 2026, asks you to confirm: acceptance passed and leftover issues accepted, the number cutover planned, users trained, operations signed into the support model, code in production, service lines have run acceptance scripts on a temporary number, and the change board has approved the cutover. On the day: agents logged in for calls and chats, post-go-live support present, a conference bridge open until success or rollback, cutover at the approved time, and the live metrics in the metrics room.",
             CHECK),
        note("mg-ba", "migrate", "advanced", "What the analyst owns in the pack",
             "From the pages above, a business-analysis pack for this kind of move contains: outcomes and success criteria from the alignment activity, the current and future journey with placeholder owners, the channel and prompt list, the RASCI and the swimlanes, the acceptance scripts, the metric definitions you will call 'expected' on go-live day, and the service lines that are out of this slice. The alignment page says you also validate timelines and costs. If a cost was not sourced, leave it blank.",
             OPS),
        note("e-gloss-cc", "ecosystem", "foundation", "Contact-center words, with a source",
             "The glossary in this lab now includes the contact-center words these rooms use: journey map, experience map, service blueprint, average handle time, service level, abandonment rate, occupancy, first-contact resolution, CSAT, after-contact work, operating model, RASCI, and workstream. Each line names the page that was opened. A word that is not in that list is not defined here.",
             NNG),
        note("e-mind", "ecosystem", "foundation", "Mind map",
             "Read the ecosystem drawing as a study map, not as a vendor architecture. The person and the goal sit in the middle. Around them: the channels, the journey and the blueprint, the queue and the flow, the agent and the customer profile, the measures, and the three migration workstreams. If a box has no opened source, it does not belong on the map.",
             FEATURE),
        note("e-tech", "ecosystem", "intermediate", "Sister technologies",
             "The feature overview describes neighboring pieces a contact-center analyst will meet. Conversational IVR and chatbots can use Amazon Lex. Customer Profiles can combine contact history with a CRM; the page names Salesforce, Zendesk, and ServiceNow. Forecasting and agent scheduling are described for the workforce team. Screen recordings are described as a way to review what an agent did. Contact flows can call AWS Lambda, including toward a CRM. Email on that page is tied to Amazon Simple Email Service. Naming a product here is a citation, not a recommendation.",
             FEATURE),
        note("e-integrate", "ecosystem", "intermediate", "Integration map",
             "A study sequence, taken from how the feature overview lays the work out, is: channel, then contact flow, then queue, then agent workspace, with a customer profile beside the agent and a case when the issue spans contacts. The WhatsApp page adds a step in front of that sequence: a business account and a verified number before any message arrives. Draw only the arrows you can name. An unnamed arrow is a gap.",
             FEATURE),
        note("e-bridge-cc", "ecosystem", "intermediate", "Bridges into the other rooms",
             "Use Foundations for the need before the platform name. Use Requirements for the handoff and the acceptance scenario. Use Modeling when the journey or the blueprint needs a picture. Use the metrics room when a chart needs a formula. Use Domains for the contact-center lens beside other industries. Use the migration room when the change is a move from a legacy platform. Shared pages do not merge the decision rights.",
             WORK),
        note("e-future-cc", "ecosystem", "advanced", "Future hooks that a page actually describes",
             "The feature overview describes generative AI agent assist during calls and chats, generated post-contact summaries, and forecasting and scheduling. Those are descriptions of a product page, not a claim that a reader's platform has them, and not a roadmap. A person still accepts any requirement a model drafts. The WhatsApp setup page adds a planning constraint you can write today: business verification can take up to 2 weeks. Features this check did not open stay unmarked.",
             FEATURE, tbd="Any vendor roadmap, quota, or price that was not on an opened page."),
    ]


CC_DIAGRAMS = [
    ("omni-parts", "Journey map elements", ["Actor, one point of view", "Scenario and expectations", "Phases", "Actions, mindsets, emotions", "Opportunities, owner, measure"], "Five elements from the Nielsen Norman article.", NNG),
    ("omni-channels", "Channels named on the overview", ["Voice", "Chat and SMS", "WhatsApp and other messaging apps", "Email", "Web, video, and tasks"], "The feature overview's list. Not a ranking.", FEATURE),
    ("omni-blueprint", "Journey then blueprint", ["Person's goal", "What they do", "Where it breaks", "Flow, queue, and actor on the business side", "Requirement and measure"], "Blueprint is the organization's side of the same journey.", NNG),
    ("aht-parts", "What this AHT adds", ["Agent interaction", "Customer hold", "After-contact work", "Task pause, if present", "Skip the record only if all four are null"], "Average of the records that remain.", METRICS),
    ("sl-split", "Removed from queue inside X", ["Answered", "Abandoned", "Callback requested", "Still waiting, not in the numerator", "Divided by contacts queued"], "Connect's service level. Answered-only is a different formula.", METRICS),
    ("metric-owner", "Before you publish a KPI", ["Question", "Formula and platform", "Source record", "Owner", "The line that triggers action"], "If the action line is not agreed, write unknown.", METRICS),
    ("migrate-streams", "Three migration workstreams", ["Operational", "Technical foundation", "User journeys", "Sprint 0 discovers and designs", "A small live slice before the rest"], "Parallel work. No timeline on the source diagram.", WORK),
    ("migrate-pack", "Analysis pack for the move", ["Outcomes and success criteria", "Journey with placeholder owners", "RASCI and swimlanes", "Acceptance scripts", "Metric definitions for go-live day"], "Costs stay blank until sourced.", OPS),
    ("eco-mind", "Contact-center mind map", ["Person and goal", "Channels", "Journey and blueprint", "Queue and flow", "Agent and profile", "Measures", "Three workstreams"], "A study map. Boxes need an opened source.", FEATURE),
    ("eco-sisters", "Sister technologies on the overview", ["IVR and bots", "CRM profiles", "Workforce scheduling", "Screen recording", "Flows toward other systems", "Email service"], "Citations, not a shortlist.", FEATURE),
    ("eco-integrate", "Integration sequence", ["Channel", "Contact flow", "Queue", "Agent workspace", "Customer profile", "Case"], "Draw an arrow only when you can name it.", FEATURE),
]

CC_FLOWS = [
    ("omni-flow", "From journey to requirement", ["Name one actor and one goal", "List phases and channels", "Mark where it breaks", "Name the owner of the fix", "Write the measure"], "One map does not cover two actors.", NNG),
    ("channel-flow", "A contact that changes channel", ["Person starts on a channel", "Self-service may go first", "Context moves with the contact", "A person joins without a restart", "The record says which channel"], "History preserved is a requirement on the overview.", FEATURE),
    ("metric-define-flow", "Fix a disputed number", ["Write the question", "Copy the formula from the report's own page", "Compute one sample by hand", "Name the owner", "Do not compare a second platform until its formula is written"], "Same name, different fraction, is a common dispute.", METRICS),
    ("migrate-ba-flow", "Artifacts before cutover", ["Align on outcomes", "Workshop the journey and name placeholder owners", "Sign the operating model", "Accept the flows", "Watch the agreed metrics as you cut over"], "Rollback is swapping the number back.", CHECK),
]

CC_GLOSSARY = [
    ("Journey map", "A visualization of the process a person goes through to accomplish a goal. One actor per map.", NNG),
    ("Experience map", "A broader picture of a general human experience, not tied to one product.", NNG),
    ("Service blueprint", "The business-side picture of a specific journey: how the organization supports the touchpoints.", NNG),
    ("Average handle time", "On the Connect metric page: average connected time with an agent, including talk, hold, after-contact work, and task pause.", METRICS),
    ("Service level", "On that page: contacts removed from the queue inside X seconds, divided by contacts queued. Removal includes answer, abandon, or callback request.", METRICS),
    ("Abandonment rate", "On that page: contacts the customer disconnected while still in queue, divided by contacts queued. Callbacks are not abandoned.", METRICS),
    ("Occupancy", "On that page: contact time divided by contact time plus idle time. It does not account for concurrency.", METRICS),
    ("First-contact resolution", "On that page's cases metric: closed cases with exactly one call, chat, or email contact.", METRICS),
    ("CSAT", "IBM: positive responses (4 or 5 out of 5, or 80 to 100 percent) divided by all responses, times 100.", IBM),
    ("After-contact work", "Time after the conversation that the Connect handle-time definition still includes.", METRICS),
    ("Operating model", "Who uses the contact center and how it is managed. Not a runbook. The migration page asks for a signed RASCI and swimlanes.", OPS),
    ("RASCI", "Responsible, accountable, supported, consulted, and informed, as the operational migration page spells the matrix.", OPS),
    ("Workstream", "A team-bound set of migration activities. The guidance page recommends operational, technical foundation, and user journeys.", WORK),
    ("Minimum lovable product", "The migration page's name for a small stable slice, such as one caller journey for a small group of agents, before later sprints.", WORK),
]

CC_STUDY = {
    "omni": {
        "five": "A journey map, as Nielsen Norman Group defines it, shows one person accomplishing one goal: actor, scenario, phases, what they do and feel, and the opportunities. A contact center then has to say which channels are in scope. The Connect Customer overview lists voice, chat and SMS, messaging apps, email, tasks, and web or video. WhatsApp, on its setup page, needs a business account, a number Meta can verify, and an inbound flow, and verification can take up to two weeks. The requirement is the context that travels with the person, the handoff to a human, and the measure. A second actor is a second map.",
        "visual": "omni-parts",
        "exampleTitle": "Worked example: one lost parcel",
        "example": [
            "Actor: a person waiting for a delivery. Scenario: the tracking page stopped two days ago, and they expect a date, not a menu. This is one map. The courier's map would be another.",
            "Phases you can check: notice, try self-serve, contact, resolve. Channels in scope only if the project confirms them: voice, chat, SMS, WhatsApp, email, or a social account. The feature overview names WhatsApp and Facebook Messenger as messaging examples. This check did not open a Messenger setup article, so those steps stay unwritten.",
            "Opportunity: the agent sees the tracking number at the start, and the person is not asked to repeat it if the channel changes. Owner: the service-line owner. Measure: you pick it in the metrics room and write the formula.",
        ],
    },
    "metrics": {
        "five": "Use the definition on the report's own page. On the Connect metric-definitions page, average handle time adds interaction, hold, after-contact work, and task pause, then averages the records that are not all null. Service level X is contacts removed from the queue inside X seconds divided by contacts queued, and removal includes an answer, an abandon, or a callback request. Abandonment is in-queue disconnects divided by contacts queued, and callbacks are not abandons. Occupancy is contact time over contact time plus idle time, and it ignores extra concurrent slots. First-contact resolution on that page is closed cases with exactly one call, chat, or email. IBM's CSAT page divides positive responses by all responses. Sample numbers below are arithmetic, not a center's results.",
        "visual": "sl-split",
        "exampleTitle": "Worked example: five sample calculations",
        "example": [
            "Handle time. Record A is 120 + 30 + 60 + 0 = 210 seconds. Record B is 90 + 0 + 30 + 0 = 120 seconds. Average = 165 seconds. If a record's four fields are all null, the page says to skip it.",
            "Service level 30. Of 100 queued contacts, 60 were answered, 10 abandoned, and 5 requested a callback, all inside 30 seconds. Removed = 75, so service level = 75 percent. Answered-only would be 60 percent. Write which formula you mean.",
            "Abandonment. 8 in-queue disconnects out of 100 queued is 8 percent. Four callbacks are not in the 8. Occupancy. 40 minutes on contacts and 10 minutes idle is 80 percent. First contact. 6 of 8 closed cases had exactly one call, chat, or email, which is 75 percent. CSAT. 30 ratings of 4 or 5 out of 40 responses is 75 percent. None of these lines is a target.",
        ],
    },
    "migrate": {
        "five": "AWS Prescriptive Guidance for a Connect migration recommends three parallel workstreams: operational, technical foundation, and user journeys. The analyst's artifacts sit mostly on the first and the third: outcomes, a journey workshop with named placeholder owners, a RASCI operating model that is not a runbook, acceptance scripts, training, and the metric definitions you will call expected on cutover day. Test functionally before business users accept. Cut over by moving the public number, and roll back by pointing it at the legacy line. The guidance diagram has no durations. Do not invent one.",
        "visual": "migrate-pack",
        "exampleTitle": "Worked example: a parcel desk, one slice",
        "example": [
            "Alignment: the outcome is that a person with a stalled parcel reaches someone who can see the tracking number. Success criteria are written with the metric formulas, not with a vendor's adjective. Cost cells with no source stay blank.",
            "Workshop attendees match the user-journeys page: project manager, architects, business analyst, service-line owner. Placeholders such as the queue greeting name an owner. The operating model says who may turn on an emergency message, not the click path.",
            "Go-live watch, from the checklist: calls answered, abandonment and handle time as expected, queue depth sensible. The expected numbers are the ones you agreed, or they are marked unknown. Rollback is swapping the number back.",
        ],
    },
    "ecosystem": {
        "five": "Business analysis sits beside product ownership, project delivery, data, architecture, and change. Shared techniques still need a named decision maker. For contact centers, the mind map in this room links the person's goal to channels, the journey and the blueprint, the queue, the agent and the CRM profile, the measures, and the three migration workstreams. Sister technologies are only the ones the feature overview describes: bots, CRM profiles, workforce scheduling, screen recording, flows that call other systems, and email. Future hooks stop where the opened page stops.",
        "visual": "eco-mind",
        "exampleTitle": "Worked example: where a question goes",
        "example": [
            "A generic retailer asks for WhatsApp. Foundations asks for the need. The omnichannel room asks which actor and which context must move. The metrics room asks which formula will show that the move helped. The migration room asks who signs the operating model.",
            "The feature overview names Salesforce, Zendesk, and ServiceNow as CRM examples a profile can combine with contact history. That is a citation. It is not a selection. Anything the pages did not describe stays off the map.",
        ],
    },
}


def cc_quizzes():
    def q(section, question, choices, answer, why, source):
        return {
            "q": question,
            "choices": choices,
            "answer": answer,
            "why": why,
            "source": source[0],
            "url": source[1],
            "asOf": AS_OF,
            "section": section,
        }

    return [
        q("omni", "Nielsen Norman's journey-map article says how many points of view belong on one map?",
          ["As many personas as the workshop invites", "One", "One per channel", "None, the map is the company's"], 1,
          "The article says to provide one point of view per map. A second actor is a second map.", NNG),
        q("omni", "The Connect WhatsApp setup page says business verification can take up to:",
          ["A few minutes, so ignore it", "2 weeks", "A time this lab invented", "It does not mention verification"], 1,
          "The page says the automated business verification process can take up to 2 weeks, and tells you to start early.", WHATSAPP),
        q("metrics", "On the Connect metric-definitions page, service level X treats which events as removal from the queue?",
          ["Only answered contacts", "An answer, an abandon, or a callback request", "Only abandons", "After-contact work"], 1,
          "The page lists those three. Answered-only is a different formula.", METRICS),
        q("metrics", "IBM's printed CSAT calculation uses which ratings as positive on a 1 to 5 scale?",
          ["Only 5", "4 and 5", "3, 4, and 5", "The mean of all scores, labeled as a percentage"], 1,
          "The page says ratings of 4 or 5 out of 5, divided by all responses, times 100.", IBM),
        q("metrics", "The Connect occupancy definition accounts for concurrent chat slots by:",
          ["Dividing by the number of slots", "Not accounting for concurrency", "Ignoring idle time", "Using abandonment as the denominator"], 1,
          "The page says occupancy does not account for concurrency. One contact for the whole interval can be 100 percent.", METRICS),
        q("migrate", "The migration guidance recommends at least which parallel workstreams?",
          ["Only a technical build", "Operational, technical foundation, and user journeys", "A single Gantt chart", "Training after go-live only"], 1,
          "Those three are the recommendation on the workstreams page.", WORK),
        q("migrate", "The operational page says the operating model should be:",
          ["A screenshot runbook for pulling logs", "A RASCI and swimlanes of who does what, signed before production", "Optional if the software is configured", "A salary plan"], 1,
          "The page says it is not a runbook, and that sign-off is a go-live requirement.", OPS),
        q("ecosystem", "A product name on the ecosystem map is:",
          ["A recommendation to buy it", "A citation of a page that opened", "Proof the reader already owns it", "A future roadmap"], 1,
          "The feature overview names products. This lab does not turn that list into a shortlist.", FEATURE),
    ]


CC_RESOURCES = [
    (NNG, "Journey map definition, five elements, and the difference from a blueprint and a story map."),
    (FEATURE, "Channels, profiles, and neighboring contact-center capabilities described by the vendor."),
    (WHATSAPP, "WhatsApp Business Account, verification, flow, and test steps."),
    (METRICS, "Handle time, service level, abandonment, occupancy, and first-contact resolution as that page defines them."),
    (IBM, "CSAT formula and the limits the page states. NPS and CES arithmetic is not printed there."),
    (WORK, "Sprint, workstream, phase, and the three parallel workstreams."),
    (JOURNEY, "Journey workshop, design source of truth, test, and cutover."),
    (OPS, "Operating model, RASCI, service introduction, and training."),
    (CHECK, "Before go-live and day-of checklists, including which metrics to watch."),
]


def cc_source_rows():
    """(label, url, kind) for pages this check opened."""
    rows = [
        (NNG[0], NNG[1], "official"),
        (FEATURE[0], FEATURE[1], "official"),
        (WHATSAPP[0], WHATSAPP[1], "official"),
        (METRICS[0], METRICS[1], "official"),
        ("Connect Customer historical metric definitions", "https://docs.aws.amazon.com/connect/latest/adminguide/historical-metrics-definitions.html", "official"),
        (IBM[0], IBM[1], "official"),
        (WORK[0], WORK[1], "official"),
        (JOURNEY[0], JOURNEY[1], "official"),
        (OPS[0], OPS[1], "official"),
        (CHECK[0], CHECK[1], "official"),
    ]
    return rows


CC_SOURCE_PAGES = {
    "omni": [0, 1, 2],
    "metrics": [3, 4, 5, 9],
    "migrate": [6, 7, 8, 9],
    "ecosystem": [0, 1, 2, 3, 6, 7],
    "domains": [1],
    "glossary": [0, 3, 5, 6, 8],
    "resources": [0, 1, 3, 5, 9],
    "home": [1, 3, 6],
}

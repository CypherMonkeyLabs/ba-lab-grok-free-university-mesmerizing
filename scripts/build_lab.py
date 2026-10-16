#!/usr/bin/env python3
"""Build catalog, diagrams, pages, and downloadable sheets for the BA lab."""
from __future__ import annotations

import html
import json
import os
import zipfile
from pathlib import Path

from docx import Document
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pptx import Presentation
from pptx.util import Emu, Inches, Pt
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet

from round2_content import EXTRA_DIAGRAMS, EXTRA_FLOWS, GAMES, INTERVIEWS, STUDY, USCIS, extra_quizzes

ROOT = Path(__file__).resolve().parents[1]
AS_OF = "2026-10"
DISCLAIMER = (
    "Independent, free, learning-only student project. Respects every company and vendor. "
    "Trademarks belong to their owners. Not affiliated or endorsed. Concerns are removed or corrected "
    "promptly via the contact form at https://cyphermonkeylabs.com/#contact. Nothing is sold. "
    "Happy to volunteer for any organization."
)
LINKS = [
    ("Website", "https://cyphermonkeylabs.com"),
    ("GitHub", "https://github.com/CypherMonkeyLabs"),
    ("Profile", "https://linktr.ee/cyphermonkey"),
    ("X", "https://x.com/Cypher0x9"),
    ("LinkedIn", "https://www.linkedin.com/in/luckylakshmanucwebex"),
    ("Hugging Face", "https://huggingface.co/Cypher0x9"),
    ("Contact", "https://cyphermonkeylabs.com/#contact"),
]
BABOK = ("BABOK Guide knowledge hub", "https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/")
FEES = ("IIBA certification fees", "https://www.iiba.org/business-analysis-certifications/certification-fees/")
FAQ = ("IIBA certification FAQ", "https://www.iiba.org/business-analysis-certifications/certification-faq")
ECBA = ("IIBA ECBA page", "https://www.iiba.org/business-analysis-certifications/ecba/")
CCBA = ("IIBA CCBA page", "https://www.iiba.org/business-analysis-certifications/ccba/")
CBAP = ("IIBA CBAP page", "https://www.iiba.org/business-analysis-certifications/cbap/")
AAC = ("IIBA Agile Analysis Certification", "https://www.iiba.org/business-analysis-certifications/agile-analysis/")
CBDA = ("IIBA CBDA page", "https://www.iiba.org/business-analysis-certifications/business-data-analytics-certification/")
PMI = ("PMI-PBA certification", "https://www.pmi.org/certifications/business-analysis-pba")
SCRUM = ("The 2020 Scrum Guide", "https://scrumguides.org/scrum-guide.html")
CSPO = ("Scrum Alliance CSPO page", "https://www.scrumalliance.org/get-certified/product-owner-track/certified-scrum-product-owner")
SAFE = ("Scaled Agile", "https://scaledagile.com/")
BPMN = ("OMG BPMN 2.0", "https://www.omg.org/spec/BPMN/2.0/About-BPMN")
UML = ("OMG UML 2.5.1", "https://www.omg.org/spec/UML/2.5.1/About-UML")
C4 = ("C4 model", "https://c4model.com/")
GHERKIN = ("Gherkin reference", "https://cucumber.io/docs/gherkin/reference/")
HEART = ("Google Research, user-centered metrics paper", "https://research.google/pubs/measuring-the-user-experience-on-a-large-scale-user-centered-metrics-for-web-applications/")
OKR = ("re:Work OKRs guide", "https://rework.withgoogle.com/guides/set-goals-with-okrs/steps/introduction/")
SPRINT = ("Google Design Sprint Kit", "https://designsprintkit.withgoogle.com/")
JTBD = ("Christensen Institute, Jobs to Be Done", "https://www.christenseninstitute.org/theory/jobs-to-be-done/")
IDEO = ("IDEO Design Thinking", "https://designthinking.ideo.com/")
ADKAR = ("Prosci ADKAR model", "https://www.prosci.com/methodology/adkar")
AMZN = ("Amazon leadership principles", "https://www.amazon.jobs/content/en/our-workplace/leadership-principles")
SRE = ("Google SRE book introduction", "https://sre.google/sre-book/introduction/")
ADO = ("Azure DevOps backlogs", "https://learn.microsoft.com/en-us/azure/devops/boards/backlogs/backlogs-overview?view=azure-devops")
PP = ("Power Platform ALM", "https://learn.microsoft.com/en-us/power-platform/alm/overview-alm")
D365 = ("Dynamics 365 implementation guide", "https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/overview")
PBI = ("Microsoft Learn, What is Power BI?", "https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview")
JIRA = ("Jira getting started", "https://www.atlassian.com/software/jira/guides/getting-started/introduction")
STORIES = ("Atlassian, user stories", "https://www.atlassian.com/agile/project-management/user-stories")
AGILE = ("Atlassian Agile", "https://www.atlassian.com/agile")
CONF = ("Confluence", "https://www.atlassian.com/software/confluence")
SQL = ("PostgreSQL SQL introduction", "https://www.postgresql.org/docs/current/tutorial-sql-intro.html")
PMINE = ("IEEE Task Force on Process Mining", "https://www.tf-pm.org/")
LUCID = ("Lucid BPMN tutorial", "https://lucid.co/diagram/bpmn/tutorial")
MIRO = ("Miro Kanban", "https://miro.com/kanban/")
FIGMA = ("Figma", "https://www.figma.com/")
VISIO = ("Microsoft Visio support", "https://support.microsoft.com/en-us/visio")
SF = ("Salesforce CRM", "https://www.salesforce.com/crm/")
FHIR = ("HL7 FHIR overview", "https://www.hl7.org/fhir/overview.html")
IRS = ("IRS, independent contractor defined", "https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-defined")
WCAG = ("WCAG 2.2 quick reference", "https://www.w3.org/WAI/WCAG22/quickref/")


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


def build_items():
    b = BABOK
    items = [
        note("f-what", "foundations", "foundation", "What business analysis is",
             "Business analysis is the work of understanding a need and recommending a change that has value. The BABOK Guide is IIBA's published standard for that practice. This lab summarizes the public structure. It does not replace the guide.",
             b),
        note("f-who", "foundations", "foundation", "Who does the work",
             "The guide's contents include a section on who a business analyst is. In practice the title varies: business analyst, business systems analyst, product owner, or consultant. The title is less important than whether someone is accountable for the need, the stakeholders, and the change.",
             b),
        note("f-baccm", "foundations", "foundation", "Core concept model",
             "The knowledge hub lists the Business Analysis Core Concept Model. Study it as six linked ideas: change, need, solution, stakeholder, value, and context. A sentence that names a solution but not the need is incomplete.",
             b, ["Change: the act of transformation.", "Need: a problem or opportunity.", "Solution: a specific way of satisfying a need.", "Stakeholder: a person or group with a relationship to the change.", "Value: the worth of something to a stakeholder in a context.", "Context: the circumstances that influence the change."]),
        note("f-req-design", "foundations", "foundation", "Requirements and designs",
             "The guide treats requirements and designs as related, not as two sealed boxes. A requirement states a condition or capability. A design describes a solution. The same statement can be read as either, depending on who consumes it. Say which reading you intend.",
             b),
        note("f-classes", "foundations", "foundation", "Requirements classification",
             "A useful study split, following the guide's classification schema, is business, stakeholder, solution, and transition. Solution requirements are often split again into functional behavior and non-functional quality. Label the class so reviewers know what 'done' means.",
             b),
        note("f-ba-pm", "foundations", "foundation", "Business analyst and project manager",
             "A project manager is accountable for the delivery plan: time, cost, and coordination. A business analyst is accountable for whether the change is worth making and whether the result meets the need. Teams combine the roles. They should not pretend the roles are the same decision.",
             b),
        note("f-ba-po", "foundations", "foundation", "Business analyst and product owner",
             "The 2020 Scrum Guide places a Product Owner on the Scrum Team with Developers and a Scrum Master, and it lists the Product Backlog as an artifact. A business analyst may support that backlog or, in some teams, hold the Product Owner accountability. Holding both without saying so hides the decision rights.",
             SCRUM),
        note("f-need", "foundations", "foundation", "Need before solution",
             "Start from the outcome a stakeholder can observe. A tool name, a screen, or a vendor is a solution hypothesis. Write the need in a sentence that would still make sense if the tool changed.",
             b),
        note("f-stake", "foundations", "foundation", "Stakeholders",
             "The guide lists stakeholders as a core topic. Map who is affected, who decides, who pays, and who can block. A person with high influence and low interest still needs a plan. Update the map when the change moves.",
             b),
        note("f-scope", "foundations", "foundation", "Scope in one paragraph",
             "Scope is the boundary of the change: what is in, what is out, and what is unknown. Write the out-of-scope list. It prevents a later argument from being treated as a surprise.",
             b),
        note("f-assume", "foundations", "foundation", "Assumptions and constraints",
             "An assumption is something you proceed with while it remains unproven. A constraint is a limit you do not get to choose, such as a law, a date, or a system you must keep. Review assumptions on a cadence. A false assumption is a risk.",
             b),
        note("f-value", "foundations", "foundation", "Value is contextual",
             "Value is not a single number. It depends on which stakeholder and which context you name. A faster call handling time can be value for an operations lead and a loss of care for a customer. State both.",
             b),
        note("e-map", "ecosystem", "foundation", "Where the practice sits",
             "Business analysis touches product ownership, project delivery, process improvement, data analysis, architecture, and change management. The BABOK Guide is the core reference in this lab. Neighboring guides are cited only where a page opened.",
             b),
        note("e-sisters", "ecosystem", "foundation", "Sister roles",
             "Product manager, product owner, project manager, process analyst, data analyst, business architect, and quality analyst share techniques with business analysis. Ask which decisions each role owns on this initiative. Shared techniques do not mean shared authority.",
             SCRUM),
        note("e-bridges", "ecosystem", "intermediate", "Bridges to other labs",
             "Contact-center work needs the same elicitation and acceptance habits, plus queue, channel, and quality measures. AI agent work needs a human review step on any requirement the model drafted. This lab links those topics. It does not claim a vendor implementation.",
             SRE),
        note("e-future", "ecosystem", "advanced", "Future hooks",
             "Useful next studies are decision modeling, process mining, and evaluation of AI-assisted analysis. Each is introduced here only as far as a public source opened. Deeper vendor features stay marked to be confirmed.",
             PMINE),
        note("k-plan", "babok", "foundation", "Planning and monitoring",
             "This knowledge area covers how the analysis itself will be run: the approach, stakeholder engagement, governance, information management, and how you will know the analysis work is performing. It is the plan for the analysis, not the plan for the whole project.",
             b, ["Plan the business analysis approach.", "Plan stakeholder engagement.", "Plan governance.", "Plan information management.", "Identify performance improvements."]),
        note("k-elic", "babok", "foundation", "Elicitation and collaboration",
             "Prepare, conduct, confirm, communicate, and keep collaboration going. Elicitation is not a single workshop. Confirmation is a separate task so that notes are not mistaken for agreement.",
             b),
        note("k-life", "babok", "foundation", "Requirements life cycle management",
             "Trace, maintain, prioritize, assess changes, and approve. A requirement without a trace to a need and to a test is a rumor. Approval is a recorded decision, not a silent meeting.",
             b),
        note("k-strat", "babok", "intermediate", "Strategy analysis",
             "Analyze the current state, define a future state, assess risks, and define a change strategy. Strategy work answers why this change, and what we are willing to risk, before the team debates screens.",
             b),
        note("k-radd", "babok", "intermediate", "Requirements analysis and design definition",
             "Specify and model, verify, validate, define the requirements architecture, define design options, and recommend a solution based on potential value. Verification asks whether the requirement is fit to use. Validation asks whether it is the right requirement.",
             b),
        note("k-eval", "babok", "intermediate", "Solution evaluation",
             "Measure performance, analyze those measures, assess solution limits, assess enterprise limits, and recommend actions that increase value. Evaluation continues after go-live. The CBAP sample material on the public page makes the same point: limitation assessment happens when the solution is in use in some form.",
             CBAP),
        note("k-comp", "babok", "foundation", "Underlying competencies",
             "The guide lists analytical thinking, behavioral characteristics, business knowledge, communication, interaction, and tools and technology. Tools are last on purpose. A diagramming product does not supply the judgment.",
             b),
        note("k-tech-list", "babok", "foundation", "Technique list",
             "The public contents list fifty techniques, from acceptance criteria and backlog management through workshops. Learn the name, the question it answers, and one way it fails. Do not memorize a vendor's menu as if it were the technique.",
             b),
        note("k-interview", "babok", "foundation", "Interviews",
             "An interview is a prepared conversation with a purpose, questions, and a written confirmation. Send the notes back. Unconfirmed notes are your memory, not the stakeholder's agreement.",
             b),
        note("k-workshop", "babok", "foundation", "Workshops",
             "A workshop gathers people who can decide or inform, with an agenda and a record. If the decision maker is absent, record the outcome as a draft.",
             b),
        note("k-observe", "babok", "foundation", "Observation",
             "Watch the work. People skip steps they no longer notice. Observation checks what an interview smooths over. Tell people you are observing, unless a formal study design says otherwise and ethics allow it.",
             b),
        note("k-doc", "babok", "foundation", "Document analysis",
             "Read the policy, the contract, the ticket history, and the old specification before you ask people to repeat them. Mark the date of each document. Old documents describe a world that may have changed.",
             b),
        note("k-proto", "babok", "intermediate", "Prototyping",
             "A prototype is a learning tool. Label its fidelity. A polished picture can be mistaken for a promise. Capture which comments changed the requirement.",
             b),
        note("k-stories", "babok", "foundation", "User stories",
             "The technique list includes user stories. A common study form is: as a role, I want a capability, so that an outcome. The outcome is the part teams skip. Atlassian publishes a user-story explanation that matches this shape.",
             STORIES),
        note("k-use", "babok", "intermediate", "Use cases and scenarios",
             "A use case names an actor and a goal, then the main path and the exceptions. Scenarios are concrete passes through that path. They become tests more easily than a paragraph of features.",
             b),
        note("k-process", "babok", "intermediate", "Process modelling and analysis",
             "Process modelling draws how work moves. Process analysis asks where it waits, loops, or fails. Draw the current state before you draw the wish.",
             BPMN),
        note("k-data", "babok", "intermediate", "Data modelling and dictionary",
             "A data model names things the business cares about and how they relate. A data dictionary defines each field, including what 'blank' means. Skip the dictionary and two teams will load different meanings into the same column.",
             b),
        note("k-nfr", "babok", "intermediate", "Non-functional requirements",
             "Quality attributes include performance, security, availability, accessibility, and retention. Write a measure. 'Fast' is not a requirement. 'The search returns in under two seconds for the agreed test' can be tested.",
             b),
        note("k-rules", "babok", "intermediate", "Business rules",
             "A business rule is a decision the organization enforces, such as who may approve a refund. Keep rules separate from process steps so a policy change does not require redrawing every flow.",
             b),
        note("k-swot", "babok", "foundation", "SWOT",
             "Strengths, weaknesses, opportunities, and threats are a snapshot. Strengths and weaknesses are internal. Opportunities and threats are external. A SWOT without a decision attached is a poster.",
             b),
        note("k-risk", "babok", "intermediate", "Risk analysis",
             "A risk is an uncertain event that would matter if it happened. Write the event, the consequence, and the response you will actually take. A risk register that nobody reviews is a filing exercise.",
             b),
        note("k-kpi", "babok", "intermediate", "Metrics and KPIs",
             "The technique list names metrics and key performance indicators. A KPI needs a definition, a source, a cadence, and a person who acts when it moves. A number without an owner is a dashboard decoration.",
             b),
        note("k-vendor", "babok", "advanced", "Vendor assessment",
             "Vendor assessment compares options against the need, not against the loudest demo. Separate must-have constraints from scored wishes. Record who scored and when.",
             b),
        note("k-case", "babok", "intermediate", "Business cases",
             "A business case recommends a course of action with costs, benefits, risks, and assumptions. If you do not know a figure, mark it unknown. Do not invent a return to make the page look finished.",
             b),
        note("k-root", "babok", "foundation", "Root cause analysis",
             "Ask why the problem happens, more than once, until you reach something the team can change. Stopping at the first cause usually names a person instead of a system.",
             b),
        note("k-pri", "babok", "foundation", "Prioritization",
             "Prioritization is a decision about sequence and sacrifice. Name the rule: value, risk, dependency, or compliance. A list where everything is high priority has not been prioritized.",
             b),
        note("k-backlog", "babok", "foundation", "Backlog management",
             "A backlog is an ordered list of options, not a warehouse of every idea. The Scrum Guide describes a Product Backlog as an artifact. Ordering it is ongoing work.",
             SCRUM),
        note("r-elic", "requirements", "foundation", "Elicitation methods",
             "Choose a method for the question. Interviews go deep with one person. Workshops align a group. Observation checks real work. Surveys reach many people with thin answers. Document analysis starts from what is already written. Say why you picked the method.",
             b),
        note("r-power", "requirements", "foundation", "Stakeholder grid",
             "A simple grid places influence on one axis and interest on the other. High influence and high interest people need close work. High influence and low interest people need concise updates. The grid is a hypothesis. Test it.",
             b),
        note("r-story", "requirements", "foundation", "Story and outcome",
             "Write the role, the capability, and the outcome. Then add acceptance criteria. Atlassian's user-story material is a public explanation of this shape. A story without a test is a wish.",
             STORIES),
        note("r-gherkin", "requirements", "intermediate", "Acceptance criteria in Gherkin",
             "Cucumber's Gherkin reference describes scenarios with Given, When, and Then. Given is context. When is the action. Then is the observable result. One scenario, one behavior. Keep the language in the business's words.",
             GHERKIN),
        note("r-trace", "requirements", "intermediate", "Traceability",
             "Trace a requirement to the need it serves, the design that satisfies it, and the test that demonstrates it. The life-cycle tasks include tracing and assessing change. When a rule changes, the trace tells you what else moves.",
             b),
        note("r-rtm", "requirements", "intermediate", "Traceability matrix",
             "A requirements traceability matrix is a table of those links. Columns that help: identifier, statement, source, owner, priority, design reference, test reference, status. A matrix that is not updated is a historical document. Say so.",
             b),
        note("r-uat", "requirements", "intermediate", "User acceptance",
             "Acceptance is a decision by the people who will live with the result, against criteria written earlier. It is not the first time anyone sees the system. Defects found here are either missed criteria or a changed need. Record which.",
             b),
        note("r-test", "requirements", "intermediate", "From criteria to tests",
             "Each acceptance criterion should suggest at least one test, including the unhappy path. A business analyst does not have to execute every test. They do have to notice when a criterion cannot be tested.",
             GHERKIN),
        note("r-moscow", "requirements", "foundation", "Must, should, could, won't",
             "Must, should, could, and won't are priority words. Must means the change fails its purpose without it. Won't means not in this scope, on purpose. The DSDM page that documents MoSCoW did not open in the October 2026 check, so it is not linked.",
             b, tbd="A live DSDM or Agile Business Consortium page for the MoSCoW definition."),
        note("r-nfr", "requirements", "intermediate", "Quality requirements you can test",
             "Pair every quality word with a threshold, a method, and a context. Accessibility can point at WCAG 2.2's quick reference. Do not write 'secure' and walk away.",
             WCAG),
        note("r-change", "requirements", "advanced", "Change control",
             "A change request names what moved, why, the impact on scope and tests, and who approved. Assess requirements changes is a life-cycle task. Verbal agreement in a hallway is not a baseline.",
             b),
        note("r-baseline", "requirements", "intermediate", "Baseline and versions",
             "A baseline is an agreed version you can compare against later. Keep the previous version. Diff the words. Teams lose arguments when the only copy is the latest edit.",
             b),
        note("m-bpmn", "modeling", "foundation", "BPMN in brief",
             "Object Management Group publishes BPMN 2.0. For study, learn events, activities, gateways, and sequence flow. A gateway is a decision, not a task. Label the outgoing paths with conditions a stranger can test.",
             BPMN),
        note("m-bpmn-now", "modeling", "intermediate", "Current state, then future",
             "Draw how the work happens this week, including the spreadsheet and the rework. Then draw the proposed state. If you only draw the future, you will miss the step that actually takes the time.",
             BPMN),
        note("m-uml", "modeling", "foundation", "UML, used sparingly",
             "OMG publishes UML. Use the diagram that answers the question in the room. A use case diagram shows who wants what. An activity diagram shows flow. A sequence diagram shows messages over time. A class diagram shows structure. One diagram, one question.",
             UML),
        note("m-erd", "modeling", "intermediate", "Entity relationships",
             "An entity is a thing you store. A relationship states how many of one relate to how many of another. Name the relationship from both directions. 'Customer places order' is clearer than a line with no verb.",
             b),
        note("m-c4", "modeling", "intermediate", "C4, four levels",
             "The C4 model site describes four abstractions: software system, container, component, and code. Start with a system context diagram: the system, the people, and the other systems. Go deeper only where the audience needs it.",
             C4),
        note("m-sipoc", "modeling", "foundation", "SIPOC",
             "Supplier, input, process, output, customer is a one-page boundary. It is enough to see whether you are looking at the right process before you draw thirty boxes. This is a study scaffold, not a claimed standard text.",
             BPMN),
        note("m-state", "modeling", "advanced", "States",
             "State models help when a thing has a life: draft, submitted, approved, rejected. Name the event that causes each move and who may cause it. The technique list includes state modelling.",
             b),
        note("m-decision", "modeling", "advanced", "Decisions apart from flow",
             "If a gateway contains a policy, lift the policy into a decision with inputs and outputs. The process then stays stable when the policy changes. Decision modelling is on the technique list.",
             b),
        note("m-iface", "modeling", "intermediate", "Interfaces",
             "Interface analysis asks what crosses a boundary: data, a document, or a handoff. For each crossing, name the producer, the consumer, the trigger, and what happens when it fails.",
             b),
        note("m-storymap", "modeling", "intermediate", "Story map",
             "A story map places user activities across the top and breaks releases downward. The first horizontal slice should be a thin outcome someone can use, not a layer of database tables.",
             STORIES),
        note("a-scrum", "agile", "foundation", "Scrum, from the 2020 guide",
             "The Scrum Guide lists three pillars: transparency, inspection, and adaptation. The team accountabilities are Developers, Product Owner, and Scrum Master. Events are the Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective. Artifacts are the Product Backlog, the Sprint Backlog, and the Increment.",
             SCRUM),
        note("a-po", "agile", "foundation", "Product owner accountability",
             "Treat the Product Owner as the person who orders the Product Backlog toward value. A business analyst can prepare options and evidence. If several people reorder the backlog, the team does not have a single accountability.",
             SCRUM),
        note("a-psm", "agile", "intermediate", "PSM and PSPO",
             "Scrum.org publishes Professional Scrum assessments. The assessment pages did not open in the 16 October 2026 check, so this lab does not link them and does not state a fee.",
             SCRUM, tbd="Current PSM and PSPO fees and the exact assessment rules on scrum.org."),
        note("a-cspo", "agile", "intermediate", "CSPO",
             "Scrum Alliance lists Certified Scrum Product Owner on its product owner track, alongside advanced and professional levels. The page opened, but the fee and the course-hour rules did not render in the static check. Do not budget from this lab.",
             CSPO, tbd="CSPO course price and the eligibility rules shown after the page's scripts run."),
        note("a-safe", "agile", "intermediate", "SAFe POPM",
             "Scaled Agile's site opened. The Product Owner / Product Manager course page returned HTTP 429 on 16 October 2026, so it is not linked and no price is copied. SAFe distinguishes product ownership at team level from product management across a larger train. Confirm the current split on their site.",
             SAFE, tbd="POPM price, duration, and exam rules."),
        note("a-kanban", "agile", "foundation", "Kanban",
             "A kanban board makes work visible and limits how much is in progress. Miro publishes a Kanban page that opened. Kanban University's home title loaded on 16 October 2026, but course names and fees did not render, so that site is not linked and no price is copied.",
             MIRO, tbd="Kanban University course names and fees."),
        note("a-dt", "agile", "foundation", "Design thinking",
             "IDEO's design thinking site opened. Use it as a reminder to spend time with the people who have the problem before you converge on a solution. It is a practice, not a certificate this lab can price.",
             IDEO),
        note("a-sprint", "agile", "intermediate", "Design sprint",
             "Google's Design Sprint Kit opened. A design sprint is a short, structured cycle of understanding, sketching, deciding, prototyping, and testing. It is not the same thing as a Scrum sprint. Say which one you mean.",
             SPRINT),
        note("a-jtbd", "agile", "intermediate", "Jobs to be done",
             "The Christensen Institute describes Jobs to Be Done as the progress a person is trying to make in a circumstance. Interview for the circumstance and the struggle, not for a feature list. A job story is a study form: when this situation, I want to make this progress, so I can reach this outcome.",
             JTBD),
        note("a-okr", "agile", "intermediate", "OKRs",
             "Google's re:Work guide introduces objectives and key results. An objective is the direction. Key results are measurable outcomes, not a task list. A business analyst can help a team tell an output from an outcome.",
             OKR),
        note("d-sql", "data", "foundation", "SQL for a question",
             "PostgreSQL's tutorial introduces SQL as the way to ask a database a question. Learn SELECT, filter, join, and group. You do not need to be the database administrator. You do need to know whether the column you were promised actually exists.",
             SQL),
        note("d-excel", "data", "foundation", "Spreadsheets",
             "A spreadsheet is often the current system. Before you replace it, learn its formulas, its hidden columns, and who repairs it on Fridays. This note is practice advice. A specific product manual is not cited because none was required for the habit.",
             BABOK),
        note("d-model", "data", "intermediate", "Conceptual, logical, physical",
             "A conceptual model uses business words. A logical model adds keys and cardinality. A physical model adds types and indexes for one database. Do not start at the physical model with stakeholders who came to talk about orders.",
             b),
        note("d-kpi", "data", "intermediate", "KPI definition sheet",
             "For each indicator write the question it answers, the formula, the grain, the source system, the refresh, the owner, and the threshold for action. HEART, from the Google Research paper on user-centered metrics, is one way to group product measures: happiness, engagement, adoption, retention, and task success.",
             HEART),
        note("d-heart", "data", "intermediate", "HEART",
             "The paper 'Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications' is the public source for the HEART categories. Use the categories as a checklist. Do not invent a benchmark number this lab did not measure.",
             HEART),
        note("d-okr", "data", "foundation", "Measures and OKRs",
             "A key result that counts tasks completed is usually an output. Prefer a result a customer or the operation can feel. Tie the measure back to the need in the business case.",
             OKR),
        note("d-pbi", "data", "foundation", "Power BI, as a study topic",
             "Microsoft Learn has a page titled What is Power BI. On 16 October 2026 the readable body asked for authorization, so this lab does not describe product features from it. Lucky's notes do not claim Power BI experience.",
             PBI, tbd="A publicly readable feature description of Power BI."),
        note("d-tableau", "data", "foundation", "Tableau, not linked",
             "Tableau is a visual analytics product teams use for dashboards. Its public page did not open in the 16 October 2026 check, so it is not linked and no feature is described. This lab does not claim Tableau experience for Lucky.",
             ("Checked 16 October 2026. No page is linked.", ""), tbd="A Tableau page that opens and can be cited."),
        note("d-mine", "data", "advanced", "Process mining",
             "The IEEE Task Force on Process Mining site opened. Process mining uses event logs to reconstruct how work actually flowed. It is evidence about the current state. It still needs a person to decide whether the flow is acceptable.",
             PMINE),
        note("d-dash", "data", "intermediate", "Dashboards",
             "A dashboard is a decision surface. Lead with the question, then the number, then the breakdown. If a chart does not change a decision, leave it off. Cite the definition of every figure.",
             HEART),
        note("t-jira", "tools", "foundation", "Jira",
             "Atlassian's getting-started guide for Jira opened. Use it to keep work visible: items, states, and owners. The workflow should match the real approval path. Do not add states nobody will use.",
             JIRA),
        note("t-conf", "tools", "foundation", "Confluence",
             "Confluence is Atlassian's space for longer pages. A requirement page needs an owner, a status, and a link to the backlog item. A page without a status looks current long after it is not.",
             CONF),
        note("t-ado", "tools", "foundation", "Azure DevOps boards",
             "Microsoft's Azure DevOps backlogs documentation opened. Boards are another place teams order work. The analysis habits are the same as in Jira: one backlog, clear states, and acceptance criteria on the item.",
             ADO),
        note("t-visio", "tools", "foundation", "Visio",
             "Microsoft's Visio support home opened. Visio is a diagramming product teams use for process and system drawings. The drawing is only as good as the labels. Export a copy stakeholders can open.",
             VISIO),
        note("t-lucid", "tools", "foundation", "Lucid and BPMN",
             "Lucid's BPMN tutorial opened. Use a shared diagram when more than one person must edit. Agree on a small stencil so the file does not become a clip-art board.",
             LUCID),
        note("t-miro", "tools", "foundation", "Miro",
             "Miro's Kanban page opened. A board is useful in a workshop because people can move notes. After the workshop, copy the decisions into the system of record. A board that is the only copy will be lost.",
             MIRO),
        note("t-figma", "tools", "foundation", "Figma",
             "Figma's home page opened. It is a collaborative design surface teams use for interfaces. Treat a frame as a prototype at a stated fidelity. Comments on a frame are not approved requirements until someone records them as such.",
             FIGMA),
        note("t-pp", "tools", "intermediate", "Power Platform and Dynamics",
             "Microsoft's Power Platform ALM overview and the Dynamics 365 implementation guide both opened. They are relevant when a solution will be configured rather than only described. The business analyst still writes the need, the roles, and the acceptance checks. This is study context, not a claim of delivery experience.",
             PP),
        note("ai-prompt", "ai", "foundation", "Prompt for a draft",
             "Ask a model for a draft you can edit: a question list, a stakeholder map, or a first pass at acceptance criteria. Give it the need, the constraint, and the audience. Read every line before it reaches a stakeholder.",
             SRE),
        note("ai-review", "ai", "foundation", "Human review",
             "The analyst remains accountable for the requirement. Check names, numbers, and rules against a source. A fluent paragraph can still be wrong. Keep the source next to the draft.",
             b),
        note("ai-hallu", "ai", "intermediate", "Invented facts",
             "Models fill gaps. If the source does not state a fee, a law, or a metric, the draft must say unknown. This lab follows that rule. You should too when you use a model on a real initiative.",
             b),
        note("ai-agent", "ai", "advanced", "Agents and omni-channel",
             "An agent that talks to a customer is a solution with requirements: what it may say, what it must hand to a person, how it is measured, and how a mistake is reversed. The SRE book's introduction is a public reminder that operations, including handoff, is part of the system.",
             SRE),
        note("ai-resp", "ai", "advanced", "Responsible use",
             "Do not paste secrets, customer data, or unpublished financials into a tool whose terms you have not read. Say when a stakeholder is talking to a model. Accessibility and appeal paths still apply.",
             WCAG),
        note("ai-eval", "ai", "advanced", "Evaluate the assistant",
             "Write a small set of cases before you trust a drafting assistant: a normal case, an edge case, and a case it should refuse. Score it. A demo is not an evaluation.",
             HEART),
        note("ai-trace", "ai", "intermediate", "Trace the draft",
             "Tag sentences that came from a model until a person checks them. In a traceability matrix, 'model draft, unreviewed' is an honest status.",
             b),
        note("ai-cc", "ai", "advanced", "Contact center handoff",
             "For a voice or chat agent, specify the moment a person takes over, what context moves with the conversation, and how the customer is not asked to start again. That handoff is a requirement, not a model parameter.",
             SRE),
        note("dom-health", "domains", "intermediate", "Healthcare",
             "Healthcare changes often involve privacy, consent, and clinical safety. The HHS HIPAA pages did not open in this check, so they are not linked and the rule text is not paraphrased. HL7's FHIR overview did open. FHIR is a published interoperability standard. Confirm every privacy rule with the organization's compliance owner.",
             FHIR, tbd="A public HIPAA page that opens, for any privacy paraphrase."),
        note("dom-bank", "domains", "intermediate", "Banking",
             "Banking analysis pays attention to identity, audit trails, segregation of duties, and retention. This lab does not cite a regulator because no regulator page was opened in the check. Do not invent a control number. Ask the compliance owner which rule applies.",
             b, tbd="A regulator page for the specific banking control you are studying."),
        note("dom-ins", "domains", "intermediate", "Insurance",
             "Insurance work turns on the policy, the claim, and the exception. Model those entities before you design a screen. Rating and reserve rules are specialist knowledge. Mark them as sourced from the carrier, not from this lab.",
             b),
        note("dom-retail", "domains", "foundation", "Retail",
             "Retail changes often involve item, price, inventory, and the path from interest to purchase. Define the grain of 'a sale'. Online and store paths diverge. Write both if both are in scope.",
             b),
        note("dom-tel", "domains", "intermediate", "Telecom",
             "Telecom analysis meets orders, service activation, and faults. Separate the customer-facing promise from the network task. A public TM Forum page was not opened in this check, so it is not linked.",
             b, tbd="A TM Forum or similar public page for the framework you want to cite."),
        note("dom-cc", "domains", "intermediate", "Contact center and CCaaS",
             "A contact-center analyst looks at why people contact, which channel they use, how work is queued, and how quality is reviewed. Specify the data a agent or a person needs at the start of the conversation. Vendor product claims stay out unless a page was opened.",
             SRE),
        note("dom-erp", "domains", "intermediate", "ERP and CRM",
             "Salesforce's CRM page opened. Dynamics 365's implementation guide opened. Both are examples of systems that already contain processes. Fit-gap analysis asks what the product does, what you will configure, and what you will not change. A gap is not automatically a customization.",
             SF),
        note("dom-reg", "domains", "advanced", "Regulation as a source",
             "When a requirement comes from a rule, cite the rule and the version. If you cannot open the text, write 'source not yet attached' rather than a guessed clause. This lab would rather show a gap than a false citation.",
             b),
        note("p-disc", "product", "foundation", "Discovery",
             "Discovery is the work of testing whether you understand the problem. Use interviews, observation, and a small experiment. A discovery output is a clearer need, a rejected idea, or a decision to stop. All three are success.",
             JTBD),
        note("p-case", "product", "intermediate", "Business case and return",
             "List costs, benefits, the timing of each, and the assumptions. If you compute a return, show the formula and the inputs. Unknown inputs stay blank. The technique list includes business cases and financial analysis. This lab states no sample return.",
             b),
        note("p-adkar", "product", "intermediate", "Change and ADKAR",
             "Prosci's ADKAR page opened and names Awareness, Desire, Knowledge, Ability, and Reinforcement. A requirement can be built and still fail if people do not know why it exists or cannot perform the new work. Plan the enablement with the solution, not after the outage.",
             ADKAR),
        note("p-ethics", "product", "foundation", "Ethics",
             "IIBA's certification FAQ says candidates agree to a code of ethical conduct. In daily work that means you do not hide a risk, you do not invent a number, and you say when you are unsure. This lab is not legal advice.",
             FAQ),
        note("p-est", "product", "intermediate", "Estimation",
             "Estimation is on the technique list. Estimate analysis work separately from build work. Give a range and what would change it. A single point estimate pretends certainty you do not have.",
             b),
        note("p-risk", "product", "intermediate", "Risk and response",
             "Write probability only if you have a basis. Otherwise use a simple high, medium, or low and say it is a judgment. Assign a response: avoid, reduce, transfer, or accept. Accepted risks need an owner.",
             b),
        note("p-rfp", "product", "advanced", "RFP and vendor selection",
             "A request for proposal should be traceable to requirements. Weight the criteria before you see the responses. Keep a record of questions and answers sent to every bidder. Vendor assessment is the related technique.",
             b),
        note("p-buy", "product", "advanced", "Build, buy, or configure",
             "The design-options task asks you to compare ways to satisfy the need. Include doing nothing. A demo is an input, not a decision. Record why the other options lost.",
             b),
        note("p-metrics", "product", "intermediate", "Success measures",
             "Define measures before build, so the team cannot move the goal after the result is known. Include a measure that would tell you to roll back.",
             HEART),
        note("p-amazon", "product", "advanced", "Working backwards",
             "Amazon's leadership principles page opened. A press-release-and-FAQ habit is associated with Amazon in public writing, but the book and the internal template were not opened in this check, so the steps are not copied. Use the principles page for what Amazon publishes, and mark any PR/FAQ outline you did not read as unknown.",
             AMZN, tbd="A primary source for the PR/FAQ template that this check can quote."),
        note("p-sre", "product", "advanced", "Operational requirements",
             "The Google SRE book introduction treats running the system as part of the engineering problem. Availability, on-call, and failure communication are requirements when a person depends on the service. Write them with the functional behavior.",
             SRE),
        note("c-roles", "careers", "foundation", "Role names",
             "Titles you will see include business analyst, junior or senior business analyst, lead, product owner, and business systems analyst. A title is not a promise of scope. Read the decisions the role owns.",
             b),
        note("c-levels", "careers", "foundation", "Levels, without pay",
             "A foundation level practices elicitation and clear writing with support. A working level runs a workstream. A senior level sets the analysis approach and coaches others. This lab states no salaries and no 'typical' pay.",
             FAQ),
        note("c-star", "careers", "foundation", "STAR, as a structure",
             "Situation, task, action, result is a way to answer a behavioral question without wandering. The result should be something you can point to: a decision, a reduced defect, a baseline. Do not invent a metric for the story.",
             b),
        note("c-bank", "careers", "intermediate", "Question bank",
             "Practice questions: tell us about a stakeholder who disagreed; how you traced a change; how you knew a requirement was testable; how you handled a missing data source. Answer from work you did. Mark practice stories as practice.",
             b),
        note("c-case", "careers", "intermediate", "Case interview",
             "A case gives you a short brief and too little time. Restate the need, name stakeholders, ask two clarifying questions, then outline scope, risks, and a first model. Say what you are assuming.",
             b),
        note("c-port", "careers", "foundation", "Portfolio pieces",
             "Three honest pieces beat a large invented program. A requirement set with acceptance criteria, a process model of a public or personal workflow, and a traceability sample are enough. Remove any private data.",
             GHERKIN),
        note("c-resume", "careers", "foundation", "Resume words",
             "Use words you can defend in the interview: elicitation, stakeholder map, user story, acceptance criteria, BPMN, traceability, UAT, workshop. Do not list a tool you have not opened.",
             STORIES),
        note("c-c2c", "careers", "advanced", "Contracting notes",
             "Corp-to-corp and similar arrangements are commercial structures. The IRS page on independent contractor status opened. Classification is a facts-and-circumstances question. This note is not tax or legal advice.",
             IRS),
        note("c-h1b", "careers", "advanced", "Sponsorship",
             "Whether an employer will sponsor a work visa is the employer's decision and a legal question. Nothing in this lab promises sponsorship or a visa outcome, and this note is not legal advice. The USCIS H-1B page opened on 16 October 2026. It describes a specialty occupation as work that applies a body of highly specialized knowledge and that normally requires a bachelor's or higher degree in a directly related specialty. The petitioner files the petition. Specialty-occupation petitions need a certified labor condition application. The same page showed fee alerts that were in flux, including a note about litigation, so this lab does not quote a fee as settled.",
             USCIS, tbd="Which fee applies to a given petition. Read the live USCIS page before anyone files."),
        note("c-cpo", "careers", "advanced", "Toward product ownership",
             "A path some analysts take is deeper discovery, outcome metrics, and backlog accountability. The Scrum Guide and the CSPO page are the public anchors in this lab. Course fees that did not render stay unknown.",
             SCRUM),
    ]
    return items


def build_glossary():
    rows = [
        ("Business analysis", "The practice of understanding a need and shaping a valuable change.", BABOK),
        ("Business analyst", "A person who performs business analysis, whatever the job title.", BABOK),
        ("Need", "A problem or opportunity to be addressed.", BABOK),
        ("Stakeholder", "A person or group with a relationship to the change.", BABOK),
        ("Requirement", "A usable representation of a need, ready for further work.", BABOK),
        ("Design", "A usable representation of a solution.", BABOK),
        ("Constraint", "A limit on the solution that the team does not choose.", BABOK),
        ("Assumption", "A belief treated as true for now, still to be confirmed.", BABOK),
        ("Scope", "The boundary of what is in and out of the change.", BABOK),
        ("Elicitation", "Drawing out information from stakeholders and other sources.", BABOK),
        ("Workshop", "A facilitated session with a purpose and a record.", BABOK),
        ("Baseline", "An agreed version used for later comparison.", BABOK),
        ("Traceability", "A link from a need to requirements, designs, and tests.", BABOK),
        ("RTM", "A requirements traceability matrix: a table of those links.", BABOK),
        ("UAT", "User acceptance testing: a decision against agreed criteria.", BABOK),
        ("User story", "A short statement of role, capability, and outcome.", STORIES),
        ("Acceptance criteria", "The conditions that show a story or requirement is met.", GHERKIN),
        ("Gherkin", "A language for scenarios using Given, When, and Then.", GHERKIN),
        ("BPMN", "Business Process Model and Notation, published by OMG.", BPMN),
        ("Gateway", "A BPMN decision point that splits or joins flow.", BPMN),
        ("UML", "Unified Modeling Language, published by OMG.", UML),
        ("ERD", "A drawing of entities and the relationships between them.", BABOK),
        ("C4", "A model with system, container, component, and code views.", C4),
        ("KPI", "A key performance indicator tied to a decision.", BABOK),
        ("HEART", "Happiness, engagement, adoption, retention, and task success.", HEART),
        ("OKR", "An objective plus measurable key results.", OKR),
        ("Product backlog", "The ordered list of what is known to be needed in the product.", SCRUM),
        ("Increment", "A concrete step toward the product goal, in Scrum.", SCRUM),
        ("Product owner", "An accountability on the Scrum Team for the backlog and value.", SCRUM),
        ("RACI", "A matrix of responsible, accountable, consulted, and informed.", BABOK),
        ("SWOT", "Strengths, weaknesses, opportunities, and threats.", BABOK),
        ("ADKAR", "Awareness, desire, knowledge, ability, and reinforcement.", ADKAR),
        ("Business case", "A recommendation that shows why a course of action is worth it.", BABOK),
        ("Fit-gap", "A comparison of what a product already does and what the need still requires.", D365),
        ("Process mining", "Reconstructing a process from event logs.", PMINE),
        ("Non-functional requirement", "A quality attribute such as speed, security, or availability.", BABOK),
        ("CBAP", "Certified Business Analysis Professional, an IIBA credential.", CBAP),
        ("ECBA", "Entry Certificate in Business Analysis, an IIBA credential.", ECBA),
        ("PMI-PBA", "PMI's Professional in Business Analysis credential.", PMI),
        ("BACCM", "The Business Analysis Core Concept Model in the BABOK Guide.", BABOK),
    ]
    return [{"term": t, "meaning": m, "source": s[0], "url": s[1], "asOf": AS_OF} for t, m, s in rows]


def build_cards(glossary):
    cards = [{"front": g["term"], "back": g["meaning"], "source": g["source"], "url": g["url"], "asOf": AS_OF} for g in glossary]
    return cards


def build_quizzes():
    src = lambda s: {"source": s[0], "url": s[1], "asOf": AS_OF}
    q = []
    def add(question, choices, answer, why, source):
        item = {"q": question, "choices": choices, "answer": answer, "why": why}
        item.update(src(source))
        q.append(item)
    add("The public BABOK contents list how many knowledge areas before underlying competencies?",
        ["Four", "Six", "Eight", "Ten"], 1,
        "Planning, elicitation, life cycle, strategy, requirements analysis and design, and solution evaluation.", BABOK)
    add("IIBA's FAQ says which of these about ECBA eligibility?",
        ["Five years of experience are required", "There are no specific eligibility requirements to sit the exam", "A degree is mandatory", "CBAP must come first"], 1,
        "The FAQ says there are no specific eligibility requirements, and candidates must agree to the code of conduct and the certification terms.", FAQ)
    add("The CCBA work-history minimum on the FAQ is:",
        ["1,000 hours", "3,750 hours in the last seven years", "7,500 hours", "No hours, like ECBA"], 1,
        "The FAQ states 3,750 hours within the last seven years, plus 21 professional-development hours.", FAQ)
    add("The CBAP exam page states the exam is:",
        ["60 questions in 90 minutes", "120 questions in 210 minutes", "200 questions in 240 minutes", "130 questions in 180 minutes"], 1,
        "The CBAP page says 120 questions and 210 minutes. The 130/180 figure on this list matches the CCBA page instead.", CBAP)
    add("On the fees page opened in October 2026, the ECBA exam column shows:",
        ["$145", "$395, with student rates available", "$1,200", "A fee was not printed"], 1,
        "The exam cell shows $395 and notes that student rates are available. The product page also says $395 or less.", FEES)
    add("PMI-PBA maintenance, as stated on the PMI page, is:",
        ["No renewal", "60 PDUs each three-year cycle", "Annual retake of the exam", "A fee only, with no learning"], 1,
        "The page says holders need 60 professional development units in each three-year cycle.", PMI)
    add("Given, When, and Then come from:",
        ["BPMN gateways", "The Gherkin reference", "A Scrum event", "An ERD cardinality"], 1,
        "Cucumber's Gherkin reference uses Given, When, and Then for scenarios.", GHERKIN)
    add("C4's four levels, as the C4 site lists them, start with:",
        ["Code, then container", "Software system, container, component, code", "Only a sequence diagram", "SWOT"], 1,
        "The C4 site names software system, container, component, and code.", C4)
    add("The 2020 Scrum Guide's artifacts include:",
        ["Only a Gantt chart", "Product Backlog, Sprint Backlog, and Increment", "A RACI and a SWOT", "A business case only"], 1,
        "Those three artifacts are in the guide's contents.", SCRUM)
    add("HEART, from the cited Google Research paper, includes:",
        ["Hiring, equity, audit, risk, tax", "Happiness, engagement, adoption, retention, task success", "Hardware, ethernet, access, routing, telephony", "Only revenue"], 1,
        "Those are the user-centered categories associated with that paper.", HEART)
    add("ADKAR, on the Prosci page, stands for words that include:",
        ["Audit, deploy, keep, archive, report", "Awareness, desire, knowledge, ability, reinforcement", "Agile, daily, kanban, and retro", "Only awareness"], 1,
        "The Prosci page uses those five words.", ADKAR)
    add("A requirement with no test and no source is best marked:",
        ["Approved", "Unknown until it is traced and made testable", "Must", "Done"], 1,
        "Traceability and testable acceptance are the habits this lab teaches. Do not approve a gap.", BABOK)
    add("This lab's rule on salaries is:",
        ["Publish average pay", "State no pay figures", "Estimate from the cert fee", "Copy marketing claims"], 1,
        "The lab states no salaries and does not repeat vendor pay claims.", FAQ)
    add("Power BI features are:",
        ["Fully described from the opened article", "Not described, because the readable body asked for authorization", "Identical to Tableau", "Claimed as Lucky's experience"], 1,
        "The Learn page opened but the body required authorization, and the lab claims no Power BI experience.", PBI)
    add("Process mining, per the task-force site, is based on:",
        ["Only interviews", "Event logs", "A SWOT poster", "A certification fee"], 1,
        "The IEEE Task Force on Process Mining is the public pointer used here. Mining reconstructs flow from logs.", PMINE)
    add("When a model drafts a requirement, the accountable person is:",
        ["The model", "The business analyst who accepts the text", "Nobody", "The font setting"], 1,
        "The analyst owns the requirement. A draft is not an approval.", BABOK)
    add("The CCBA exam page states:",
        ["130 questions and 180 minutes", "120 questions and 210 minutes", "An untimed oral exam", "No exam"], 1,
        "The CCBA page says 130 multiple-choice questions and 180 minutes.", CCBA)
    add("A baseline is:",
        ["The newest unreviewed edit", "An agreed version you can compare later", "A salary band", "A theme color"], 1,
        "Without an agreed version, change control has nothing to diff.", BABOK)
    for item in extra_quizzes():
        q.append(item)
    return q


def build_certs():
    fee_note = (
        "Figures are US dollars from the IIBA fees page on 16 October 2026. "
        "IIBA says prices can change. Where a cell contains both a large figure and a 'Members' or 'Non-Members' line, both are copied as printed. Confirm which line applies to you before you pay."
    )
    return [
        {
            "id": "ecba",
            "title": "ECBA",
            "summary": "Entry Certificate in Business Analysis. The product page describes a bundle at $395 or less that includes membership, the exam, a practice exam, and a learning journey. Student rates are described as $315 or less, depending on region.",
            "facts": [
                "FAQ: no specific eligibility requirements to sit the exam. Candidates must agree to the code of ethical conduct and the certification terms.",
                "Fees table, application column: Not required.",
                "Fees table, exam column: $395 (student rates available). Product page: $395 or less.",
                "Fees table, rewrite column: $95, and the same cell says Non-Members $250.",
                "Fees table, recertification column: Not required.",
                fee_note,
            ],
            "source": "IIBA ECBA, fees, and FAQ",
            "url": ECBA[1],
            "asOf": AS_OF,
            "tbd": "",
        },
        {
            "id": "ccba",
            "title": "CCBA",
            "summary": "Certification of Capability in Business Analysis, aimed at practitioners with a few years of experience.",
            "facts": [
                "FAQ: 21 professional-development hours in the last four years.",
                "FAQ: 3,750 hours of business analysis work in the last seven years, aligned to the knowledge areas, with minimums across areas as the FAQ details.",
                "Two references are required on the CCBA page's application list.",
                "Exam page: 130 scenario-based questions, 180 minutes.",
                "Blueprint on the CCBA page: planning 12%, elicitation 20%, life cycle 18%, strategy 12%, requirements analysis and design 32%, solution evaluation 6%.",
                "Fees table: application $145. Exam cell $405 with the line Members $250. Rewrite cell $195 with the line Non-Members $350. Recertification cell $85 with the line Non-Members $120.",
                fee_note,
            ],
            "source": CCBA[0],
            "url": CCBA[1],
            "asOf": AS_OF,
            "tbd": "",
        },
        {
            "id": "cbap",
            "title": "CBAP",
            "summary": "Certified Business Analysis Professional, for experienced practitioners.",
            "facts": [
                "FAQ and CBAP page: 7,500 hours in the last 10 years, and 35 professional-development hours in the last four years.",
                "FAQ: at least 900 hours in each of four of the six knowledge areas, at least 3,600 of the 7,500.",
                "Two references. Application fee is separate from the exam fee. The page says the application expires within 12 months and is non-refundable.",
                "Exam: 120 questions, 210 minutes.",
                "Blueprint: planning 14%, elicitation 12%, life cycle 15%, strategy 15%, requirements analysis and design 30%, solution evaluation 14%.",
                "Fees table: application $145. Exam cell $505 with the line Members $350. Rewrite cell $295 with the line Non-Members $450. Recertification cell $85 with the line Non-Members $120.",
                fee_note,
            ],
            "source": CBAP[0],
            "url": CBAP[1],
            "asOf": AS_OF,
            "tbd": "",
        },
        {
            "id": "aac",
            "title": "AAC",
            "summary": "IIBA Agile Analysis Certification. The product page says $405 or less, including membership and the exam.",
            "facts": [
                "FAQ: no prerequisites for the specialty certifications. Two years in the specialty are recommended, not required.",
                "Fees table: application not required. Exam cell $405 with the line Members $250. Rewrite cell $195 with the line Non-Members $350. Recertification cell $30 with the line Non-Members $50.",
                fee_note,
            ],
            "source": AAC[0],
            "url": AAC[1],
            "asOf": AS_OF,
            "tbd": "A public AAC exam outline with domain percentages, if you need the blueprint. It was not copied because it was not read on the opened page.",
        },
        {
            "id": "cbda",
            "title": "CBDA",
            "summary": "Certification in Business Data Analytics. The page lists six blueprint domains.",
            "facts": [
                "Domains on the CBDA page: research questions 20%, source data 15%, analyze data 16%, interpret and report 20%, influence decisions 20%, guide organization strategy 9%.",
                "FAQ: no prerequisites. Two years in the specialty are recommended, not required.",
                "Fees table matches the AAC row: application not required; exam cell $405 with Members $250; rewrite cell $195 with Non-Members $350; recertification cell $30 with Non-Members $50.",
                fee_note,
            ],
            "source": CBDA[0],
            "url": CBDA[1],
            "asOf": AS_OF,
            "tbd": "",
        },
        {
            "id": "pmi",
            "title": "PMI-PBA",
            "summary": "PMI Professional in Business Analysis. The page describes experience paths and the exam shape. It does not show an exam fee in the text that loaded.",
            "facts": [
                "Set A: secondary degree, 60 months of business analysis in the last 8 years, 35 contact hours.",
                "Set B: bachelor's degree or higher, 36 months in the last 8 years, 35 contact hours.",
                "Set C: GAC-accredited bachelor's or postgraduate degree, 24 months, 35 contact hours.",
                "Exam: 200 questions, 240 minutes. Domains: needs assessment 18%, planning 22%, analysis 35%, traceability and monitoring 15%, evaluation 10%.",
                "Maintenance: 60 PDUs each three-year cycle.",
            ],
            "source": PMI[0],
            "url": PMI[1],
            "asOf": AS_OF,
            "tbd": "The PMI-PBA exam fee. It was not on the page text that loaded.",
        },
        {
            "id": "scrum-certs",
            "title": "PSM, PSPO, and CSPO",
            "summary": "Scrum.org assessment pages did not open. Scrum Alliance's CSPO page opened, without a readable fee.",
            "facts": [
                "Use the 2020 Scrum Guide for the framework itself.",
                "Do not copy a fee from memory.",
            ],
            "source": CSPO[0],
            "url": CSPO[1],
            "asOf": AS_OF,
            "tbd": "PSM, PSPO, and CSPO prices and prerequisites.",
        },
        {
            "id": "popm",
            "title": "SAFe POPM",
            "summary": "Scaled Agile's home page opened. The POPM course URL returned HTTP 429, so no price is copied.",
            "facts": ["Confirm the current course on scaledagile.com before you pay or plan time off."],
            "source": SAFE[0],
            "url": SAFE[1],
            "asOf": AS_OF,
            "tbd": "POPM price, length, and exam rules.",
        },
    ]


def build_resources():
    pairs = [
        (BABOK, "Public contents of the BABOK Guide, including knowledge areas and the technique list."),
        (FEES, "Fee table transcribed in the certifications room."),
        (FAQ, "Eligibility answers for ECBA, CCBA, CBAP, AAC, and CBDA."),
        (ECBA, "ECBA bundle price and positioning."),
        (CCBA, "CCBA exam length and blueprint."),
        (CBAP, "CBAP exam length and blueprint."),
        (AAC, "AAC bundle description."),
        (CBDA, "CBDA domains."),
        (PMI, "PMI-PBA eligibility, exam shape, and PDUs. Fee not shown."),
        (SCRUM, "2020 Scrum Guide."),
        (CSPO, "CSPO is listed. Fee did not render."),
        (SAFE, "Organization home. POPM course page did not open."),
        (BPMN, "BPMN 2.0 specification about-page."),
        (UML, "UML 2.5.1 about-page."),
        (C4, "Four-level architecture model."),
        (GHERKIN, "Given, When, Then."),
        (HEART, "User-centered metrics paper."),
        (OKR, "Objectives and key results introduction."),
        (SPRINT, "Design sprint kit."),
        (JTBD, "Jobs to Be Done."),
        (IDEO, "Design thinking home."),
        (ADKAR, "Change model. The five words appear on the page."),
        (AMZN, "Leadership principles. The PR/FAQ practice is not an official page on this site, so it is not described as Amazon policy."),
        (SRE, "Operations as part of the system."),
        (ADO, "Backlogs in Azure DevOps."),
        (PP, "Application lifecycle management for Power Platform."),
        (D365, "Dynamics 365 implementation guide overview."),
        (PBI, "Title page only. Body asked for authorization."),
        (JIRA, "Jira introduction."),
        (STORIES, "User stories."),
        (AGILE, "Atlassian agile overview."),
        (CONF, "Confluence product page."),
        (SQL, "SQL tutorial."),
        (PMINE, "Process mining task force."),
        (LUCID, "BPMN tutorial."),
        (MIRO, "Kanban page."),
        (FIGMA, "Product home. Feature list not quoted."),
        (VISIO, "Visio support home."),
        (SF, "CRM overview."),
        (FHIR, "Healthcare interoperability overview."),
        (IRS, "Independent contractor definition. Not tax advice."),
        (WCAG, "Accessibility quick reference."),
        (("CypherMonkey Labs", "https://cyphermonkeylabs.com/#contact"), "Contact for a correction. No email is published in this lab."),
        (USCIS, "H-1B specialty-occupation description. Not legal advice. Fees on that page were in flux, so none are copied."),
    ]
    return [{"title": p[0][0], "url": p[0][1], "note": p[1], "asOf": AS_OF} for p in pairs]


def build_templates():
    return [
        {"title": "Business requirements outline", "summary": "Why the change exists, for a sponsor.",
         "lines": ["Problem or opportunity in one paragraph.", "Stakeholders and the decision maker.", "Outcomes and how they will be measured.", "Scope in and scope out.", "Constraints, assumptions, and risks.", "Recommendation, or a clear statement that more discovery is required."]},
        {"title": "Functional requirements outline", "summary": "What the solution must do, in testable statements.",
         "lines": ["Identifier and statement.", "Source and owner.", "Related business requirement.", "Acceptance criteria.", "Data needed.", "Exception behavior."]},
        {"title": "Software requirements outline", "summary": "A study SRS skeleton. Not an ISO reproduction.",
         "lines": ["Purpose and audience.", "Definitions.", "Interfaces.", "Functions.", "Quality attributes with measures.", "Open issues marked unknown."]},
        {"title": "User story card", "summary": "Role, capability, outcome, and scenarios.",
         "lines": ["As a … I want … so that …", "Given, When, Then for the main path.", "One unhappy path.", "Notes and out of scope."]},
        {"title": "RACI", "summary": "One accountable person per decision.",
         "lines": ["Rows are decisions or deliverables, not vague topics.", "Exactly one A.", "R does the work. C is asked. I is told.", "If two people both claim A, the matrix is not finished."]},
        {"title": "SWOT", "summary": "A snapshot that ends in a choice.",
         "lines": ["Internal strengths and weaknesses.", "External opportunities and threats.", "One decision the snapshot supports.", "Date and participants."]},
        {"title": "Process map checklist", "summary": "Before you call a drawing finished.",
         "lines": ["Start and end are events.", "Every gateway path is labeled.", "Rework is visible.", "The current state is labeled current.", "A stakeholder has confirmed the unhappy path."]},
    ]


def build_course():
    return [
        {"minutes": "6", "title": "What this lab is", "href": "start.html", "text": "Set the display the way you want to read. The lab is free, cited, and silent about pay."},
        {"minutes": "8", "title": "Need, value, and roles", "href": "foundations.html", "text": "Read the core concept model and the difference between analyst, project manager, and product owner."},
        {"minutes": "10", "title": "Six knowledge areas", "href": "babok.html", "text": "Skim the six areas and three techniques you have not used."},
        {"minutes": "8", "title": "A testable requirement", "href": "requirements.html", "text": "Write one story and one Given-When-Then scenario in your own notes."},
        {"minutes": "8", "title": "One picture", "href": "modeling.html", "text": "Pick BPMN or C4 and name the question the picture answers."},
        {"minutes": "6", "title": "Delivery frame", "href": "agile.html", "text": "Match the words you use to the Scrum Guide or to a design sprint, and do not mix them."},
        {"minutes": "6", "title": "A measure", "href": "data.html", "text": "Define one KPI with a source and an owner. Leave unknown numbers blank."},
        {"minutes": "8", "title": "Credentials and practice", "href": "certs.html", "text": "Read the fee cells, then take the quiz or the sort game. Confirm any fee before you pay."},
    ]


def build_charts(items, diagrams, flows, cards):
    return [
        {"title": "CBAP exam blueprint", "unit": "%", "source": CBAP[0], "url": CBAP[1], "asOf": AS_OF,
         "rows": [{"label": "Planning", "value": 14}, {"label": "Elicitation", "value": 12}, {"label": "Life cycle", "value": 15}, {"label": "Strategy", "value": 15}, {"label": "Analysis and design", "value": 30}, {"label": "Evaluation", "value": 14}]},
        {"title": "CCBA exam blueprint", "unit": "%", "source": CCBA[0], "url": CCBA[1], "asOf": AS_OF,
         "rows": [{"label": "Planning", "value": 12}, {"label": "Elicitation", "value": 20}, {"label": "Life cycle", "value": 18}, {"label": "Strategy", "value": 12}, {"label": "Analysis and design", "value": 32}, {"label": "Evaluation", "value": 6}]},
        {"title": "PMI-PBA domains", "unit": "%", "source": PMI[0], "url": PMI[1], "asOf": AS_OF,
         "rows": [{"label": "Needs assessment", "value": 18}, {"label": "Planning", "value": 22}, {"label": "Analysis", "value": 35}, {"label": "Traceability", "value": 15}, {"label": "Evaluation", "value": 10}]},
        {"title": "CBDA domains", "unit": "%", "source": CBDA[0], "url": CBDA[1], "asOf": AS_OF,
         "rows": [{"label": "Research questions", "value": 20}, {"label": "Source data", "value": 15}, {"label": "Analyze", "value": 16}, {"label": "Interpret", "value": 20}, {"label": "Influence decisions", "value": 20}, {"label": "Org strategy", "value": 9}]},
        {"title": "This repository", "unit": "", "source": "Counted from this lab's catalog", "url": "", "asOf": AS_OF,
         "rows": [{"label": "Notes", "value": len(items)}, {"label": "Diagrams", "value": len(diagrams)}, {"label": "Flows", "value": len(flows)}, {"label": "Flashcards", "value": len(cards)}]},
    ]


DIAGRAMS = [
    ("baccm", "Core concept model", ["Change", "Need", "Solution", "Stakeholder", "Value", "Context"], "Six ideas from the BABOK core concept model. Study links, not a copy of the guide's figure.", BABOK),
    ("areas", "Six knowledge areas", ["Planning and monitoring", "Elicitation and collaboration", "Life cycle management", "Strategy analysis", "Analysis and design", "Solution evaluation"], "The six areas in the public contents.", BABOK),
    ("classes", "Requirement classes", ["Business", "Stakeholder", "Solution, functional", "Solution, quality", "Transition"], "A study split of the classification schema.", BABOK),
    ("elicitation", "Elicitation loop", ["Prepare", "Conduct", "Confirm", "Communicate", "Collaborate"], "Tasks listed under elicitation and collaboration.", BABOK),
    ("trace", "Trace chain", ["Need", "Requirement", "Design", "Test", "Release note"], "If a box has no arrow in your real work, the chain is broken.", BABOK),
    ("grid", "Stakeholder grid", ["High influence, high interest: work closely", "High influence, low interest: keep satisfied", "Low influence, high interest: keep informed", "Low influence, low interest: watch"], "A hypothesis, not a fact about a person.", BABOK),
    ("bpmn", "BPMN pieces", ["Start event", "Activity", "Gateway", "End event", "Sequence flow"], "Labels a beginner needs before a large diagram.", BPMN),
    ("storymap", "Story map", ["Activity across the top", "Tasks under each activity", "First release is a thin slice", "Later releases add depth"], "A slice is an outcome, not a technical layer.", STORIES),
    ("c4", "C4 levels", ["System context", "Container", "Component", "Code"], "Stop at the level the audience can use.", C4),
    ("erd", "Small order model", ["Customer", "places", "Order", "contains", "Item"], "Name the relationship. Cardinality still needs a conversation.", BABOK),
    ("raci", "RACI roles", ["Responsible: does the work", "Accountable: one owner", "Consulted: asked before", "Informed: told after"], "Two accountables means the decision is unclear.", BABOK),
    ("swot", "SWOT quadrants", ["Strengths, internal", "Weaknesses, internal", "Opportunities, external", "Threats, external"], "End with a decision, or the poster is unfinished.", BABOK),
    ("heart", "HEART categories", ["Happiness", "Engagement", "Adoption", "Retention", "Task success"], "Categories from the cited metrics paper. No benchmark numbers.", HEART),
    ("okr", "OKR shape", ["Objective: direction", "Key result: measurable", "Not a task list", "Reviewed on a cadence"], "From the re:Work introduction.", OKR),
    ("dt", "Discover before converge", ["Learn from the people", "Define the need", "Explore options", "Test a small version"], "IDEO's site is the public pointer. This drawing is ours.", IDEO),
    ("jtbd", "Job story", ["When this situation", "I want this progress", "So I can reach this outcome", "Forces that resist the switch"], "Circumstance first. Feature second.", JTBD),
    ("adkar", "ADKAR", ["Awareness", "Desire", "Knowledge", "Ability", "Reinforcement"], "Words from the Prosci page. The drawing is a study aid.", ADKAR),
    ("case", "Business case parts", ["Need", "Options, including do nothing", "Costs you can source", "Benefits you can source", "Risks and assumptions", "Recommendation or unknown"], "Blank cells stay blank.", BABOK),
    ("rtm", "Matrix columns", ["ID", "Statement", "Source", "Design link", "Test link", "Status"], "Status may be unreviewed. Say so.", BABOK),
    ("domains", "Domain lenses", ["Healthcare", "Banking", "Insurance", "Retail", "Telecom", "Contact center", "ERP and CRM"], "Same analysis moves. Different constraints. Uncited rules stay unmarked.", FHIR),
    ("career", "Career evidence", ["Clear writing", "A traced requirement", "A confirmed model", "A measure with an owner", "A story you can defend"], "No pay bands on this drawing.", FAQ),
    ("ecosystem", "Ecosystem map", ["Business analysis", "Product ownership", "Project delivery", "Data analysis", "Architecture", "Change", "Quality"], "Sister topics. Authority still has to be named.", SCRUM),
    ("sprint", "Scrum events", ["Sprint", "Planning", "Daily scrum", "Review", "Retrospective"], "Names from the 2020 Scrum Guide contents.", SCRUM),
    ("ai", "AI draft loop", ["Source material", "Model draft", "Human check", "Trace update", "Stakeholder review"], "Unreviewed model text is not a requirement.", BABOK),
]
DIAGRAMS.extend(EXTRA_DIAGRAMS)

FLOWS = [
    ("elicit-flow", "From question to baseline", ["Prepare the questions", "Hold the conversation", "Send notes back", "Edit from the reply", "Baseline the agreed lines"], "Confirmation is a step, not a mood.", BABOK),
    ("story-flow", "Story to scenario", ["Name the role and outcome", "Write Given, When, Then", "Add one unhappy path", "Link a test", "Put it on the backlog"], "A story without Then is not ready.", GHERKIN),
    ("change-flow", "A change request", ["Name what moved", "Find the traces", "Estimate impact", "Record the decision", "Update the baseline"], "A hallway yes is not a decision record.", BABOK),
    ("uat-flow", "Acceptance cycle", ["Criteria exist first", "People try the result", "Gaps are classified", "Need-change or defect", "Decision is recorded"], "The first viewing should not be acceptance.", BABOK),
    ("discover-flow", "Discovery", ["Observe or interview", "Restate the job", "Sketch two options", "Test the smaller one", "Keep, change, or stop"], "Stopping is an allowed outcome.", JTBD),
    ("sprint-flow", "A Scrum sprint", ["Order the backlog", "Plan the sprint", "Build an increment", "Review with stakeholders", "Retrospect the way of working"], "Event names follow the 2020 guide. Durations are not copied here.", SCRUM),
    ("kanban-flow", "Kanban movement", ["Options", "Ready", "In progress, with a limit", "Review", "Done"], "The limit is the point. A board with no limit is a to-do list.", MIRO),
    ("design-sprint-flow", "Design sprint sequence", ["Understand", "Sketch", "Decide", "Prototype", "Test with people"], "This follows the design-sprint shape, not a Scrum sprint.", SPRINT),
    ("vendor-flow", "Vendor selection", ["Must-have constraints", "Weighted wishes, scored before demos", "Same questions to each bidder", "Evidence against each criterion", "Decision and why the others lost"], "Weight the criteria first.", BABOK),
    ("mining-flow", "Process mining loop", ["Define the question", "Get an event log you are allowed to use", "See the actual paths", "Compare with the official flow", "Decide what to change"], "A log is personal data until someone says otherwise.", PMINE),
    ("ai-flow", "Assisted requirements", ["Provide source and constraint", "Ask for a draft", "Check every fact", "Mark unreviewed lines", "Only then show stakeholders"], "Fluent is not the same as sourced.", BABOK),
    ("cc-flow", "Contact reason to requirement", ["Why people contact", "Channel they use", "Data needed at the start", "When a person must take over", "How you will know it improved"], "The handoff is a requirement.", SRE),
    ("kpi-flow", "Measure loop", ["Question the number answers", "Formula and source", "Owner and cadence", "Threshold for action", "Review after release"], "A chart without an owner waits forever.", HEART),
    ("case-flow", "Business case path", ["Need", "Options", "Sourced costs and benefits", "Risks", "Recommend or say unknown"], "Unknown is a permitted recommendation.", BABOK),
]
FLOWS.extend(EXTRA_FLOWS)


def xml(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def wrap(text, limit):
    words = text.split()
    lines, cur = [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if len(trial) > limit and cur:
            lines.append(cur)
            cur = word
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines or [""]


def write_diagrams():
    out = ROOT / "assets" / "diagrams"
    out.mkdir(parents=True, exist_ok=True)
    meta = []
    colors = ["#99f6e4", "#c7d2fe", "#fbcfe8", "#fde68a", "#bbf7d0", "#fed7aa", "#bae6fd"]
    for did, title, labels, caption, source in DIAGRAMS:
        cols = 3 if len(labels) > 4 else 2
        box_w, gap_x, gap_y = 250, 28, 22
        pad_x, top = 36, 78
        prepared = []
        for label in labels:
            lines = wrap(label, 26)
            prepared.append(lines)
        box_h = max(64, 20 + 22 * max(len(p) for p in prepared))
        rows = (len(labels) + cols - 1) // cols
        width = pad_x * 2 + cols * box_w + (cols - 1) * gap_x
        height = top + rows * box_h + (rows - 1) * gap_y + 78
        parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img">',
            f"<title>{xml(title)}</title>",
            "<style>",
            "@keyframes baPulse { 50% { opacity: 0.78 } }",
            ".ba-box { animation: baPulse 2.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }",
            "@media (prefers-reduced-motion: reduce) { .ba-box { animation: none } }",
            "</style>",
            f'<rect width="100%" height="100%" rx="24" fill="#0b1220"/>',
            f'<text x="{pad_x}" y="46" fill="#f8fafc" font-family="Segoe UI, sans-serif" font-size="26" font-weight="700">{xml(title)}</text>',
        ]
        for i, lines in enumerate(prepared):
            r, c = divmod(i, cols)
            x = pad_x + c * (box_w + gap_x)
            y = top + r * (box_h + gap_y)
            fill = colors[i % len(colors)]
            parts.append(f'<rect class="ba-box" x="{x}" y="{y}" width="{box_w}" height="{box_h}" rx="16" fill="{fill}"/>')
            start_y = y + (box_h - 22 * len(lines)) / 2 + 16
            for li, line in enumerate(lines):
                parts.append(
                    f'<text x="{x + 16}" y="{start_y + li * 22}" fill="#1c1917" font-family="Segoe UI, sans-serif" font-size="16">{xml(line)}</text>'
                )
        parts.append(f'<text x="{pad_x}" y="{height - 28}" fill="#e2e8f0" font-family="Segoe UI, sans-serif" font-size="14">{xml(caption[:110])}</text>')
        parts.append("</svg>")
        file_rel = f"assets/diagrams/{did}.svg"
        (ROOT / file_rel).write_text("\n".join(parts), encoding="utf-8")
        meta.append({
            "id": did,
            "title": title,
            "file": file_rel,
            "alt": title + ". " + caption,
            "caption": caption,
            "source": source[0],
            "url": source[1],
            "asOf": AS_OF,
        })
    return meta


def build_flows():
    return [{
        "id": fid,
        "title": title,
        "steps": steps,
        "caption": caption,
        "source": source[0],
        "url": source[1],
        "asOf": AS_OF,
    } for fid, title, steps, caption, source in FLOWS]


PAGES = [
    ("home", "index.html", "Business Analyst Free University", "A free study lab for business analysis, from foundations through credentials."),
    ("start", "start.html", "Start here", "A one-hour path through the business analysis lab."),
    ("foundations", "foundations.html", "Foundations", "What business analysis is and how the roles differ."),
    ("ecosystem", "ecosystem.html", "Ecosystem", "Glossary links, sister roles, and future hooks."),
    ("babok", "babok.html", "BABOK", "A study map of the BABOK Guide knowledge areas and techniques."),
    ("requirements", "requirements.html", "Requirements", "Elicitation, stories, acceptance criteria, and traceability."),
    ("modeling", "modeling.html", "Modeling", "BPMN, UML, ERD, and C4 in plain language."),
    ("agile", "agile.html", "Agile", "Scrum, Kanban, design thinking, and jobs to be done."),
    ("data", "data.html", "Data", "SQL, measures, and process mining for business analysts."),
    ("tools", "tools.html", "Tools", "Jira, Confluence, Visio, Miro, Lucid, and Figma."),
    ("ai", "ai.html", "AI for business analysts", "Drafting help, review, and responsible use."),
    ("domains", "domains.html", "Domains", "Healthcare, banking, insurance, retail, telecom, and contact centers."),
    ("product", "product.html", "Product craft", "Discovery, business case, change, risk, and vendors."),
    ("certs", "certs.html", "Certifications", "IIBA, PMI-PBA, and adjacent credentials with cited fees."),
    ("careers", "careers.html", "Careers", "Roles and interviews, with no pay claims."),
    ("practice", "practice.html", "Practice", "Flashcards, a quiz, and a sort game."),
    ("diagrams", "diagrams.html", "Diagrams", "Study drawings for the business analysis lab."),
    ("flows", "flows.html", "Flows", "Animated sequences from need to accepted change."),
    ("charts", "charts.html", "Charts", "Exam blueprints and counts from this repository."),
    ("glossary", "glossary.html", "Glossary", "Short business analysis definitions."),
    ("resources", "resources.html", "Resources", "Links that opened in the October 2026 check."),
    ("templates", "templates.html", "Templates", "Outlines for BRD, FRD, SRS, stories, RACI, SWOT, and process maps."),
    ("downloads", "downloads.html", "Downloads", "PDF, PPTX, DOCX, and HTML cheat sheets with sizes."),
    ("search", "search.html", "Search", "Search the business analysis lab."),
    ("credits", "credits.html", "Credits", "What this lab made, and what it did not copy."),
]


def write_pages():
    for page, filename, title, desc in PAGES:
        doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)} · Business Analyst Free University</title>
<meta name="description" content="{html.escape(desc)}">
<script src="assets/js/boot.js"></script>
<link rel="stylesheet" href="assets/css/lab.css">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body data-page="{page}">
<a class="skip" href="#main">Skip to content</a>
<div class="top-chrome">
<button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span><span></span></button>
<div class="section-banner" id="section-banner"></div>
</div>
<main id="main" tabindex="-1"></main>
<footer class="site-footer" id="site-footer"></footer>
<nav class="phone-bar" id="phone-bar" aria-label="Quick actions"></nav>
<div id="guide-mount"></div>
<script src="assets/js/frame.js"></script>
<script src="assets/js/app.js"></script>
<script type="module" src="guide/guide.js"></script>
</body>
</html>
"""
        (ROOT / filename).write_text(doc, encoding="utf-8")


def footer_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFillColorRGB(0.93, 0.99, 0.96)
    canvas.setStrokeColorRGB(0.06, 0.46, 0.43)
    canvas.setLineWidth(1.4)
    canvas.roundRect(28, 86, letter[0] - 56, 58, 8, fill=1, stroke=1)
    canvas.setFillColorRGB(0.07, 0.31, 0.29)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(40, 126, "Shield")
    text = DISCLAIMER
    canvas.drawString(78, 126, text[:105])
    canvas.drawString(40, 114, text[105:220])
    canvas.drawString(40, 102, text[220:335])
    canvas.setFillColorRGB(0.07, 0.09, 0.16)
    canvas.rect(0, 0, letter[0], 80, fill=1, stroke=0)
    canvas.setFillColorRGB(0.95, 0.96, 0.98)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(36, 64, "CypherMonkey Labs")
    canvas.drawString(180, 64, "© 2026 CypherMonkeyLabs")
    x = 36
    for label, url in LINKS:
        canvas.setFillColorRGB(0.45, 0.85, 0.8)
        canvas.roundRect(x, 10, 72, 16, 3, fill=1, stroke=0)
        canvas.setFillColorRGB(0.1, 0.1, 0.1)
        canvas.setFont("Helvetica", 6.5)
        canvas.drawString(x + 4, 15, label[:12])
        canvas.linkURL(url, (x, 10, x + 72, 26), relative=0)
        x += 76
    canvas.restoreState()


def write_pdf(path: Path, title: str, paragraphs, bullets):
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("t", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=18, textColor="#1c1917", spaceAfter=8)
    body = ParagraphStyle("b", parent=styles["BodyText"], fontName="Helvetica", fontSize=11, leading=15, textColor="#1c1917")
    story = [Paragraph(title, title_style), Paragraph("Business Analyst Free University. Study notes, October 2026.", body), Spacer(1, 8)]
    for para in paragraphs:
        story.append(Paragraph(para, body))
        story.append(Spacer(1, 6))
    if bullets:
        story.append(ListFlowable([ListItem(Paragraph(item, body)) for item in bullets], bulletType="bullet", leftIndent=16))
    story.append(Spacer(1, 10))
    story.append(Paragraph(DISCLAIMER, ParagraphStyle("d", parent=body, fontSize=8, leading=11, textColor="#44403c")))
    doc = SimpleDocTemplate(str(path), pagesize=letter, leftMargin=0.7 * inch, rightMargin=0.7 * inch, topMargin=0.7 * inch, bottomMargin=2.15 * inch, title=title)
    doc.build(story, onFirstPage=footer_canvas, onLaterPages=footer_canvas)


def add_docx_link(paragraph, label, url):
    part = paragraph.part
    rel_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), rel_id)
    run = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    color = OxmlElement("w:color")
    color.set(qn("w:val"), "1D4ED8")
    rpr.append(color)
    run.append(rpr)
    text = OxmlElement("w:t")
    text.text = label
    run.append(text)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def write_docx(path: Path, templates):
    doc = Document()
    doc.add_heading("Business analysis templates", 0)
    doc.add_paragraph("Study scaffolds for your own notes. Not a company's official form. October 2026.")
    for item in templates:
        doc.add_heading(item["title"], level=1)
        doc.add_paragraph(item["summary"])
        for line in item["lines"]:
            doc.add_paragraph(line, style="List Bullet")
    doc.add_heading("Footer", level=1)
    doc.add_paragraph("CypherMonkey Labs")
    doc.add_paragraph("© 2026 CypherMonkeyLabs")
    doc.add_paragraph(DISCLAIMER)
    p = doc.add_paragraph()
    for i, (label, url) in enumerate(LINKS):
        if i:
            p.add_run("   ")
        add_docx_link(p, label, url)
    section = doc.sections[0]
    footer = section.footer
    footer.paragraphs[0].text = "CypherMonkey Labs · © 2026 CypherMonkeyLabs · " + DISCLAIMER[:180]
    fp = footer.add_paragraph()
    for i, (label, url) in enumerate(LINKS):
        if i:
            fp.add_run("  ")
        add_docx_link(fp, label, url)
    doc.save(path)


def write_pptx(path: Path, slides):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]
    for title, lines in slides:
        slide = prs.slides.add_slide(blank)
        box = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(12.2), Inches(0.8))
        box.text_frame.text = title
        box.text_frame.paragraphs[0].font.size = Pt(28)
        box.text_frame.paragraphs[0].font.bold = True
        body = slide.shapes.add_textbox(Inches(0.6), Inches(1.3), Inches(12), Inches(4.6))
        frame = body.text_frame
        frame.word_wrap = True
        for i, line in enumerate(lines):
            p = frame.paragraphs[0] if i == 0 else frame.add_paragraph()
            p.text = line
            p.font.size = Pt(18)
        foot = slide.shapes.add_textbox(Inches(0.5), Inches(6.15), Inches(12.2), Inches(1.1))
        fp = foot.text_frame
        fp.word_wrap = True
        fp.text = "CypherMonkey Labs · © 2026 CypherMonkeyLabs\n" + DISCLAIMER[:220]
        fp.paragraphs[0].font.size = Pt(10)
        x = Inches(0.5)
        for label, url in LINKS:
            shape = slide.shapes.add_textbox(x, Inches(6.95), Inches(2.2), Inches(0.35))
            shape.text_frame.text = label
            shape.text_frame.paragraphs[0].font.size = Pt(12)
            shape.click_action.hyperlink.address = url
            x += Inches(2.3)
    prs.save(path)


def write_html_sheet(path: Path, title: str, summary: str, lines):
    items = "\n".join(f"<li>{html.escape(line)}</li>" for line in lines)
    badges = "\n".join(
        f'<a href="{html.escape(url)}">{html.escape(label)}</a>' for label, url in LINKS
    )
    path.write_text(f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<style>
body {{ margin: 0; font-family: "Segoe UI", sans-serif; background: #fbf7f1; color: #1c1917; }}
main {{ width: min(42rem, calc(100% - 2rem)); margin: 1.5rem auto 2rem; }}
h1 {{ line-height: 1.2; }}
a {{ color: #1d4ed8; }}
.disclaimer-box {{ border: 2px solid #0f766e; background: #ecfdf5; color: #134e4a; border-radius: 16px; padding: 0.9rem 1rem; box-shadow: 0 0 0 4px rgba(14,165,233,.25); }}
.disclaimer-box a {{ color: #0f766e; }}
footer {{ padding: 1rem; background: linear-gradient(90deg, #99f6e4, #c7d2fe, #fbcfe8); color: #1c1917; }}
.badges a {{ display: inline-block; min-width: 44px; min-height: 44px; margin: 0.25rem; padding: 0.6rem 0.8rem; background: #fff; border-radius: 12px; font-weight: 700; text-decoration: none; }}
</style>
</head>
<body>
<main>
<h1>{html.escape(title)}</h1>
<p>{html.escape(summary)}</p>
<ul>
{items}
</ul>
<p>Business Analyst Free University. Study sheet, October 2026.</p>
</main>
<footer>
<div class="disclaimer-box"><p><strong>Shield.</strong> {html.escape(DISCLAIMER)}</p></div>
<p><strong>CypherMonkey Labs</strong></p>
<p class="badges">{badges}</p>
<p>© 2026 CypherMonkeyLabs 🐒</p>
</footer>
</body>
</html>
""", encoding="utf-8")


def write_diagram_html(path: Path, title: str, svg_text: str, caption: str):
    badges = "\n".join(
        f'<a href="{html.escape(url)}">{html.escape(label)}</a>' for label, url in LINKS
    )
    path.write_text(f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<style>
body {{ margin: 0; font-family: "Segoe UI", sans-serif; background: #07111f; color: #f8fafc; }}
main {{ width: min(60rem, calc(100% - 2rem)); margin: 1rem auto 2rem; }}
svg {{ width: 100%; height: auto; }}
.disclaimer-box {{ border: 2px solid #0f766e; background: #ecfdf5; color: #134e4a; border-radius: 16px; padding: 0.9rem 1rem; box-shadow: 0 0 0 4px rgba(14,165,233,.25), 0 0 24px rgba(45,212,191,.45); }}
.disclaimer-box a {{ color: #0f766e; }}
footer {{ padding: 1rem; }}
.badges a {{ display: inline-block; min-width: 44px; min-height: 44px; margin: 0.25rem; padding: 0.6rem 0.8rem; background: #fff; color: #1c1917; border-radius: 12px; font-weight: 700; text-decoration: none; }}
</style>
</head>
<body>
<main>
<h1>{html.escape(title)}</h1>
<p>{html.escape(caption)}</p>
{svg_text}
</main>
<footer>
<div class="disclaimer-box"><p><strong>Shield.</strong> {html.escape(DISCLAIMER)}</p></div>
<p><strong>CypherMonkey Labs</strong></p>
<p class="badges">{badges}</p>
<p>© 2026 CypherMonkeyLabs 🐒</p>
</footer>
</body>
</html>
""", encoding="utf-8")


def write_downloads(templates, diagrams=None, cards=None):
    folder = ROOT / "downloads"
    html_dir = folder / "html"
    html_dir.mkdir(parents=True, exist_ok=True)
    files = []
    sheets = [
        ("brd-outline.pdf", "Business requirements outline", templates[0]),
        ("frd-outline.pdf", "Functional requirements outline", templates[1]),
        ("srs-outline.pdf", "Software requirements outline", templates[2]),
        ("user-story-card.pdf", "User story card", templates[3]),
        ("raci-sheet.pdf", "RACI sheet", templates[4]),
        ("swot-sheet.pdf", "SWOT sheet", templates[5]),
        ("process-map-sheet.pdf", "Process map checklist", templates[6]),
    ]
    for filename, title, template in sheets:
        write_pdf(folder / filename, title, [template["summary"], "Copy the lines into your own document. Leave unknown items blank."], template["lines"])
        files.append((f"downloads/{filename}", title, "PDF"))
        html_name = filename.replace(".pdf", ".html")
        write_html_sheet(html_dir / html_name, title, template["summary"], template["lines"])
        files.append((f"downloads/html/{html_name}", title + " (HTML)", "HTML"))
    write_pdf(
        folder / "cert-fee-notes.pdf",
        "Certification fee notes, October 2026",
        [
            "These notes copy figures from IIBA pages opened on 16 October 2026. Prices change. Confirm before you pay.",
            "ECBA exam cell: $395 (student rates available). Product page: $395 or less, and student rates $315 or less by region.",
            "CCBA application cell: $145. Exam cell: $405, with the line Members $250.",
            "CBAP application cell: $145. Exam cell: $505, with the line Members $350.",
            "AAC and CBDA exam cell: $405, with the line Members $250. Application: not required.",
            "PMI-PBA exam fee: not shown on the page that loaded. Marked to be confirmed.",
            "PSM, PSPO, CSPO course price, and SAFe POPM price: not copied.",
        ],
        ["This lab states no salaries.", "CypherMonkey Labs. Not sold."],
    )
    files.append(("downloads/cert-fee-notes.pdf", "Certification fee notes", "PDF"))
    write_docx(folder / "ba-templates.docx", templates)
    files.append(("downloads/ba-templates.docx", "Template workbook", "DOCX"))
    write_pptx(folder / "ba-study-deck.pptx", [
        ("Business Analyst Free University", ["A free study lab.", "Fundamentals through credentials.", "Fees are cited. Unknowns stay unknown."]),
        ("Start with the need", ["Name the stakeholder.", "Name the outcome.", "A tool is not a need."]),
        ("Six knowledge areas", ["Plan the analysis.", "Elicit and confirm.", "Trace and approve.", "Strategy, requirements, evaluation."]),
        ("Make it testable", ["Story: role, capability, outcome.", "Given, When, Then.", "Trace to a test."]),
        ("Pictures", ["BPMN for flow.", "C4 for system context.", "One question per drawing."]),
        ("Credentials", ["Read the fee cell.", "Confirm on the official page.", "This deck states no salaries."]),
        ("Practice", ["Flashcards and a quiz live in the lab.", "Scores stay in your browser.", "Correct us via the contact form."]),
    ])
    files.append(("downloads/ba-study-deck.pptx", "Study deck", "PPTX"))
    zip_path = folder / "ba-html-sheets.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for html_file in sorted(html_dir.glob("*.html")):
            zf.write(html_file, arcname=html_file.name)
    files.append(("downloads/ba-html-sheets.zip", "HTML sheets, zipped", "ZIP"))
    diagram_dir = folder / "diagrams"
    diagram_dir.mkdir(parents=True, exist_ok=True)
    for diagram in diagrams or []:
        svg_path = ROOT / diagram["file"]
        svg_text = svg_path.read_text(encoding="utf-8")
        svg_copy = diagram_dir / f"{diagram['id']}.svg"
        svg_copy.write_text(svg_text, encoding="utf-8")
        files.append((f"downloads/diagrams/{diagram['id']}.svg", diagram["title"] + " SVG", "SVG"))
        html_copy = diagram_dir / f"{diagram['id']}.html"
        write_diagram_html(html_copy, diagram["title"], svg_text, diagram["caption"])
        files.append((f"downloads/diagrams/{diagram['id']}.html", diagram["title"] + " HTML", "HTML"))
    card_list = cards or []
    (folder / "flashcards.json").write_text(json.dumps(card_list, indent=2), encoding="utf-8")
    files.append(("downloads/flashcards.json", "Flashcards", "JSON"))
    card_lines = [f"{card['front']}: {card['back']}" for card in card_list]
    write_html_sheet(html_dir / "flashcards.html", "Flashcards", "Term on the left, study meaning on the right.", card_lines)
    files.append(("downloads/html/flashcards.html", "Flashcards HTML", "HTML"))
    write_pdf(folder / "flashcards.pdf", "Flashcards", ["Flip these in the lab, or read them here."], card_lines[:80])
    files.append(("downloads/flashcards.pdf", "Flashcards PDF", "PDF"))
    cheat_lines = [
        "Need before solution.",
        "One accountable owner.",
        "Trace to a test.",
        "Unhappy path is drawn.",
        "Unknown stays blank.",
        "Confirm a fee before you pay.",
        "No salaries in this lab.",
    ]
    write_html_sheet(html_dir / "cheat-sheet.html", "One-page cheat sheet", "Seven habits from this lab.", cheat_lines)
    files.append(("downloads/html/cheat-sheet.html", "Cheat sheet HTML", "HTML"))
    write_pdf(folder / "cheat-sheet.pdf", "One-page cheat sheet", ["Seven habits. The rooms expand them."], cheat_lines)
    files.append(("downloads/cheat-sheet.pdf", "Cheat sheet PDF", "PDF"))
    downloads = []
    for rel, title, kind in files:
        downloads.append({"file": rel, "title": title, "kind": kind, "bytes": (ROOT / rel).stat().st_size})
    return downloads


def write_readme(downloads, counts):
    rows = "\n".join(
        f"| {item['title']} | `{item['file']}` | {item['kind']} | {item['bytes'] / 1024:.1f} KB |"
        for item in downloads
    )
    text = f"""# Business Analyst Free University

A free study lab for business analysis. Open the app, then the rooms. Lucky is a student sharing notes on systems, contact centers, and AI omni-channel work. Nothing here is for sale.

**Fundamentals through credentials, with the source on the note.**

<p>
<a href="index.html"><img alt="" src="assets/diagrams/baccm.svg" width="88" height="52"> Open the app</a>
&nbsp;·&nbsp; <a href="https://cyphermonkeylabs.com">Website</a>
&nbsp;·&nbsp; <a href="https://github.com/CypherMonkeyLabs">GitHub</a>
&nbsp;·&nbsp; <a href="https://linktr.ee/cyphermonkey">Profile</a>
&nbsp;·&nbsp; <a href="https://cyphermonkeylabs.com/#contact">Contact</a>
&nbsp;·&nbsp; <a href="https://x.com/Cypher0x9">X</a>
&nbsp;·&nbsp; <a href="https://www.linkedin.com/in/luckylakshmanucwebex">LinkedIn</a>
&nbsp;·&nbsp; <a href="https://huggingface.co/Cypher0x9">Hugging Face</a>
</p>

## Run it

```bash
python3 -m http.server 8742
```

Open `http://127.0.0.1:8742/`. `npm run verify` checks local files, the catalog size, and that the lab has no email link.

## What is inside

{counts['notes']} notes, {counts['diagrams']} diagrams, {counts['flows']} flows, {counts['cards']} flashcards. Themes, text size, text color, and a guide in the corner.

| Sheet | Path | Kind | Size |
| --- | --- | --- | --- |
{rows}

## Disclaimer

{DISCLAIMER}

**CypherMonkey Labs**

© 2026 CypherMonkeyLabs 🐒

[Website](https://cyphermonkeylabs.com) · [GitHub](https://github.com/CypherMonkeyLabs) · [Profile](https://linktr.ee/cyphermonkey) · [Contact](https://cyphermonkeylabs.com/#contact) · [X](https://x.com/Cypher0x9) · [LinkedIn](https://www.linkedin.com/in/luckylakshmanucwebex) · [Hugging Face](https://huggingface.co/Cypher0x9)
"""
    (ROOT / "README.md").write_text(text, encoding="utf-8")


def main():
    items = build_items()
    glossary = build_glossary()
    cards = build_cards(glossary)
    quizzes = build_quizzes()
    diagrams = write_diagrams()
    flows = build_flows()
    templates = build_templates()
    downloads = write_downloads(templates, diagrams, cards)
    counts = {
        "notes": len(items),
        "diagrams": len(diagrams),
        "flows": len(flows),
        "cards": len(cards),
    }
    catalog = {
        "asOf": AS_OF,
        "narration": (
            "Welcome. This is a free study lab for business analysis. "
            "Start with what the work is, then the six knowledge areas, then a testable requirement. "
            "Prices are copied only from pages opened in October 2026. Anything missing is marked to be confirmed. "
            "Nothing here is sold, and this lab states no salaries."
        ),
        "counts": counts,
        "items": items,
        "glossary": glossary,
        "flashcards": cards,
        "quizzes": quizzes,
        "diagrams": diagrams,
        "flows": flows,
        "charts": build_charts(items, diagrams, flows, cards),
        "resources": build_resources(),
        "downloads": downloads,
        "templates": templates,
        "certs": build_certs(),
        "course": build_course(),
        "study": STUDY,
        "games": GAMES,
        "interviews": INTERVIEWS,
        "credits": [
            {"name": "Study notes, diagrams, and the guide monkey", "note": "Original work in this repository. Drawings illustrate the notes. They are not copies of a vendor figure.", "license": "Original"},
            {"name": "Web Speech API", "note": "Optional browser voice. No speech audio is redistributed. A local open-licensed TTS engine was not available at build time, so there are no pre-recorded clips.", "license": "Platform"},
            {"name": "three.js", "note": "Not shipped. The guide uses layered SVG and CSS so phones do not download a 3D engine.", "license": "Not included"},
        ],
    }
    data = ROOT / "assets" / "data"
    data.mkdir(parents=True, exist_ok=True)
    (data / "catalog.json").write_text(json.dumps(catalog, indent=2), encoding="utf-8")
    (data / "socials.json").write_text(json.dumps([
        {"id": "site", "label": "Website", "href": "https://cyphermonkeylabs.com"},
        {"id": "github", "label": "GitHub", "href": "https://github.com/CypherMonkeyLabs"},
        {"id": "profile", "label": "Profile", "href": "https://linktr.ee/cyphermonkey"},
        {"id": "contact", "label": "Contact", "href": "https://cyphermonkeylabs.com/#contact"},
        {"id": "x", "label": "X", "href": "https://x.com/Cypher0x9"},
        {"id": "linkedin", "label": "LinkedIn", "href": "https://www.linkedin.com/in/luckylakshmanucwebex"},
        {"id": "huggingface", "label": "Hugging Face", "href": "https://huggingface.co/Cypher0x9"},
    ], indent=2), encoding="utf-8")
    write_pages()
    write_readme(downloads, counts)
    (ROOT / ".nojekyll").write_text("", encoding="utf-8")
    print(json.dumps(counts))


if __name__ == "__main__":
    main()

# Ajaia AI-Native Full Stack Product Engineer Assessment

## Master Project Blueprint

**Candidate:** Paul Emmanuelle Quimpo\
**Assessment:** Full Stack Product Engineer\
**Timebox:** 240 minutes\
**Goal:** Ship a focused, testable collaborative document editor that
satisfies every core requirement without overengineering.

------------------------------------------------------------------------

# 0. Naming and Submission Identity

## Assessment Submission

Use a neutral, descriptive identity for all materials submitted to Ajaia:

**Collaborative Document Editor**  
**Full Stack Product Engineer Technical Assessment**

**Candidate:** Paul Emmanuelle Quimpo

Do not foreground a standalone commercial/product brand in the assessment submission. The assignment is intended to demonstrate engineering execution, product judgment, AI-native workflow, and delivery quality rather than provide additional branding work.

Recommended submitted repository/folder name:

```text
collaborative-document-editor
```

Recommended README opening:

```markdown
# Collaborative Document Editor

Full Stack Product Engineer Technical Assessment

## Overview

A lightweight collaborative document editing application demonstrating
rich-text editing, persistence, file import, document ownership, and
user-to-user sharing.
```

## Portfolio Version

**Inky** is reserved as a possible future personal portfolio/product identity.

If the assessment project is later expanded independently, it can be forked or reworked into:

**Inky**  
*Ideas flow better together.*

Possible future portfolio enhancements include production authentication, real-time collaboration, comments, version history, richer import/export, improved tests, and a polished product identity.

Keep the assessment submission and any later portfolio branding conceptually separate.

---

# 1. Product Strategy

Build the smallest coherent collaborative document workflow:

**Create → Edit rich text → Save → Reopen → Import file → Share → View
as another user**

The assessment rewards product judgment and delivery discipline.
Prioritize a reliable end-to-end product over recreating Google Docs.

## Core product slice

The application will support:

-   Create a document
-   Rename a document
-   Rich-text editing
-   Save and reopen documents
-   Import `.txt` and `.md` files as editable documents
-   Seeded/mock users
-   Document ownership
-   Share documents with another user
-   Separate **My Documents** and **Shared With Me** views
-   Persistent content and sharing state
-   Server-side access enforcement
-   Basic validation/error handling
-   At least one meaningful automated test
-   Live deployment
-   Clear documentation
-   3--5 minute walkthrough video

## Explicitly deprioritized

Do **not** implement these unless all core requirements are finished
early:

-   Real-time collaborative editing
-   Production authentication
-   Registration/password recovery
-   JWT/OAuth
-   Comments/suggestion mode
-   Version history
-   DOCX parsing
-   PDF export
-   Microservices
-   Complex state management
-   Advanced permissions
-   Pixel-perfect Google Docs cloning

These are deliberate scope cuts, not omissions.

------------------------------------------------------------------------

# 2. Recommended Stack

## Frontend

-   React
-   TypeScript
-   TipTap rich-text editor

## Backend

-   Python
-   Django
-   Django REST Framework

## Persistence

-   PostgreSQL preferred
-   SQLite acceptable if PostgreSQL or deployment setup becomes a time
    sink

## Deployment

Use the fastest reliable free deployment path available.

Possible split: - Frontend: Vercel - Backend: Render

Deployment reliability is more important than infrastructure
sophistication.

------------------------------------------------------------------------

# 3. Product Experience

## Main layout

### Sidebar

``` text
Documents

+ New Document
+ Import File

MY DOCUMENTS
  Product Notes
  Weekly Plan

SHARED WITH ME
  Marketing Draft
```

### Main editor

``` text
Document Title                         Share

------------------------------------------------
B   I   U   H1   H2   • List   1. List
------------------------------------------------

                Document content

Saved
```

### User switcher

``` text
Viewing as:
Paul ▼
```

The reviewer can switch between seeded users to demonstrate sharing
without needing multiple accounts or browsers.

------------------------------------------------------------------------

# 4. Rich-Text Editing

Use TipTap and support:

-   Bold
-   Italic
-   Underline
-   Heading/text-size variation
-   Bulleted list
-   Numbered list

Persist structured editor content, preferably TipTap JSON, so formatting
survives refresh/reopen.

Use an explicit **Save** button as the baseline implementation and
display clear dirty, saving, saved, and error states. This is the most
reliable behavior for the assessment and avoids save races when switching
documents or simulated users.

Only after the complete core workflow is working and deployed, autosave
may be added as an optional enhancement using a debounce around 800--1000
ms and displaying:

``` text
Saving...
Saved
```

Autosave must not replace or delay the reliable manual-save workflow.

------------------------------------------------------------------------

# 5. File Upload Strategy

Support only:

-   `.txt`
-   `.md`

Behavior:

**Upload file → read content → create new editable document**

The browser should read the selected file and send the filename plus
editable TipTap JSON to the import endpoint. The server must validate the
`.txt` or `.md` extension and create the persisted document. This avoids
unnecessary server-side file storage and server-side TipTap conversion.

For Markdown, use one small, established frontend parsing dependency if it
works reliably. If Markdown-to-rich-text conversion becomes a time risk,
import the Markdown as editable text rather than building a custom parser.

The filename can become the initial document title.

Clearly state supported formats in:

-   UI
-   README

Do not implement DOCX unless all required functionality is already
complete.

------------------------------------------------------------------------

# 6. Sharing Model

Use seeded/mock users rather than production authentication.

Example users:

``` text
Paul
Alex
```

The application should have:

-   An owner for every document
-   Ability for the owner to share with another seeded user
-   My Documents section
-   Shared With Me section
-   Backend authorization enforcing access

Only the owner should be able to grant sharing access.

A shared user can read and edit the document. Only the owner can share or
delete it. Viewer/editor roles are intentionally deferred.

Document the decision:

> Authentication was intentionally simulated with seeded users so the
> assessment timebox could focus on document ownership, sharing
> authorization, persistence, editing quality, and full-stack execution.

------------------------------------------------------------------------

# 7. Data Model

## User

Use a small application-level seeded user model rather than Django's
authentication user model. Production authentication is deliberately out
of scope, so password and authentication framework configuration would add
cost without improving the assessed workflow.

``` text
id
name
email
```

## Document

``` text
id
title
content
owner
created_at
updated_at
```

## DocumentShare

``` text
id
document
user
created_at
```

Add a database uniqueness constraint on `(document, user)` so the same
document cannot be shared with the same user twice. A document also cannot
be shared with its owner.

Keep the schema intentionally small.

------------------------------------------------------------------------

# 8. Authorization Rules

Backend authorization must enforce document access rather than relying
only on frontend filtering.

Conceptually:

``` python
document.owner == current_user
OR
document.shares.filter(user=current_user).exists()
```

Sharing action:

``` python
current_user == document.owner
```

Permission matrix:

``` text
Owner       read, update, delete, share
Shared user read, update
Other user  no access
```

An unauthorized user should receive an appropriate error response.

This is an important engineering-quality signal.

------------------------------------------------------------------------

# 9. API Contract

Keep the API minimal.

``` text
GET    /api/documents/
POST   /api/documents/

GET    /api/documents/:id/
PATCH  /api/documents/:id/
DELETE /api/documents/:id/

POST   /api/documents/import/
POST   /api/documents/:id/share/

GET    /api/users/
```

For the prototype, simulated user identity can be communicated using
something lightweight such as:

``` text
X-User-Id
```

Do not spend assessment time implementing production authentication.

The import endpoint accepts JSON containing the original filename and
TipTap JSON generated after the browser reads the selected file. It does
not persist the uploaded source file.

------------------------------------------------------------------------

# 10. Validation and Error Handling

Include practical validation for:

-   Empty/invalid document titles
-   Unsupported file types
-   Failed file uploads
-   Unauthorized document access
-   Invalid share targets
-   Duplicate shares where appropriate
-   API/network failures

UI errors should be understandable rather than exposing raw exceptions.

------------------------------------------------------------------------

# 11. Automated Testing

Minimum requirement: one meaningful automated test.

Highest-value test:

``` text
test_shared_user_can_access_document_but_unshared_user_cannot
```

This demonstrates:

-   Ownership
-   Sharing
-   Authorization
-   API behavior
-   Persistence logic

If time permits, add:

``` text
test_non_owner_cannot_share_document
```

Do not sacrifice deployment or core functionality to create a large test
suite.

------------------------------------------------------------------------

# 12. Repository Documentation

Create these files early:

``` text
README.md
ARCHITECTURE.md
AI_WORKFLOW.md
SUBMISSION.md
```

## README.md

Include:

-   Product overview
-   Features
-   Supported file types
-   Tech stack
-   Prerequisites
-   Backend setup
-   Frontend setup
-   Database setup
-   Seeded users
-   How to demonstrate sharing
-   How to run tests
-   Live deployment URL
-   Known limitations

## ARCHITECTURE.md

Opening scope statement:

> This implementation focuses on the smallest coherent collaborative
> document workflow that can be delivered reliably within the assessment
> timebox: rich-text document creation and editing, persistence,
> text/Markdown import, document ownership, sharing between simulated
> users, and backend-enforced access control.

Explain why these were deferred:

-   Real-time collaboration
-   Production authentication
-   Comments
-   Version history
-   DOCX parsing
-   Advanced roles

## AI_WORKFLOW.md

Track AI use while building rather than reconstructing it at the end.

Example:

``` markdown
## Scope Decomposition

Used ChatGPT to decompose the assignment into core requirements,
delivery risks, and optional functionality.

### Human decision

Prioritized document CRUD, persistent rich-text editing, file import,
sharing/access control, deployment, and testing.

### Rejected/deferred

Real-time collaboration, comments, version history, DOCX parsing,
and production authentication because they would reduce core
delivery quality within the timebox.
```

## SUBMISSION.md

List exactly:

-   Source code
-   Live application URL
-   Seeded/test users
-   README
-   Architecture note
-   AI workflow note
-   Automated test
-   Walkthrough video
-   Screenshots if included
-   Known limitations
-   What would be built with another 2--4 hours

------------------------------------------------------------------------

# 13. AI-Native Development Strategy

AI should accelerate implementation without making engineering decisions
on the candidate's behalf.

## Good uses of AI

-   Requirement decomposition
-   Architecture brainstorming
-   CRUD scaffolding
-   Serializer/API boilerplate
-   TipTap integration assistance
-   Test scaffolding
-   Debugging
-   Code review
-   Documentation review
-   Identifying edge cases

## Human judgment to demonstrate

Explicitly document decisions such as:

-   Simulated users instead of full authentication
-   TXT/Markdown instead of DOCX
-   Backend-enforced authorization
-   Structured rich-text persistence
-   Avoiding unnecessary abstractions
-   Deferring real-time collaboration
-   Choosing reliability over feature count
-   Reviewing and modifying AI-generated code

## Verification

Do not claim AI output was accepted blindly.

Verify using:

-   Manual browser testing
-   API behavior
-   Automated tests
-   Refresh/reopen persistence testing
-   User-switch sharing testing
-   Error-state testing
-   Deployment smoke test

------------------------------------------------------------------------

# 14. Development Sequence

## Phase 1 --- Scaffold and Architecture

Create:

-   Repository/project
-   Frontend
-   Backend
-   Data models
-   Seed users
-   Documentation skeletons

Before large implementation, confirm:

-   Directory structure
-   Data model
-   API contract
-   Core flow

------------------------------------------------------------------------

## Phase 2 --- Backend Core

Implement:

1.  User model/seed users
2.  Document model
3.  DocumentShare model
4.  Serializers
5.  Document CRUD
6.  Current simulated user handling
7.  Authorization
8.  Meaningful authorization test
9.  Sharing endpoint
10. File import endpoint
11. Validation

Core backend must work before adding optional features.

The authorization test belongs here rather than at the end because access
control is a core product behavior and should be proven before frontend
integration can mask backend mistakes.

------------------------------------------------------------------------

## Phase 3 --- Frontend Core

Implement:

1.  Main layout
2.  Sidebar
3.  User switcher
4.  Document list
5.  Create document
6.  Open document
7.  Rename document
8.  TipTap editor
9.  Formatting toolbar
10. Save/reopen behavior

------------------------------------------------------------------------

## Phase 4 --- Collaboration Workflow

Implement:

-   Share button/dialog
-   Select seeded user
-   Grant access
-   My Documents
-   Shared With Me
-   Switch users and demonstrate access

Verify the backend actually rejects unauthorized access.

------------------------------------------------------------------------

## Phase 5 --- File Import

Implement:

``` text
Import File
    ↓
Choose .txt/.md
    ↓
Read in browser and convert to editable TipTap JSON
    ↓
Validate the extension again on the server
    ↓
Create document
    ↓
Open in editor
```

------------------------------------------------------------------------

## Phase 6 --- Quality

Add:

-   Error handling
-   Loading/saving state
-   Empty states
-   Meaningful automated authorization test
-   Basic UI cleanup

Do not spend excessive time polishing CSS.

------------------------------------------------------------------------

## Phase 7 --- Deployment

Create the first deployment as soon as create, edit, save, refresh, and
reopen work end to end. Continue sharing, import, and final quality work
against deployable configuration so infrastructure problems surface while
there is still recovery time.

After deployment verify:

1.  Application loads
2.  Create works
3.  Edit works
4.  Formatting persists
5.  Refresh/reopen works
6.  Import works
7.  Share works
8.  User switching works
9.  Unauthorized access is blocked

If the preferred infrastructure creates significant friction, simplify.

------------------------------------------------------------------------

# 15. Time Budget

Target completion before the timer reaches zero.

## First \~15 minutes

Planning, scaffold, models, architecture.

## Next \~45 minutes

Backend core.

## Next \~60 minutes

Frontend/editor core.

## Next \~25 minutes

Sharing and file import integration.

## Next \~20 minutes

Testing, validation, error handling.

## Next \~25 minutes

Deployment.

## Next \~20 minutes

README, architecture, AI workflow, submission notes.

## Next \~15 minutes

Walkthrough video.

## Final \~10 minutes

Google Drive organization, live smoke test, links, final submission.

Keep a buffer.

------------------------------------------------------------------------

# 16. Hard Prioritization Rules

1.  **Working beats sophisticated.**
2.  **Required beats optional.**
3.  **End-to-end beats isolated features.**
4.  **Backend authorization beats fake frontend security.**
5.  **Deployment beats extra polish.**
6.  **One meaningful test beats many trivial tests.**
7.  **Document decisions while working.**
8.  **Never sacrifice the submission buffer for a stretch feature.**
9.  **If infrastructure fights back, simplify.**
10. **No optional stretch work until every required deliverable is
    covered.**

------------------------------------------------------------------------

# 17. Walkthrough Video Plan

Keep the recording around 3--5 minutes.

## 0:00--0:30 --- Introduction

Briefly explain:

-   Product
-   Stack
-   Scope strategy

## 0:30--2:30 --- Main flow

Demonstrate:

1.  Select Paul
2.  Create document
3.  Rename
4.  Enter formatted content
5.  Save
6.  Refresh/reopen
7.  Import TXT/Markdown
8.  Share with Alex
9.  Switch to Alex
10. Show document under Shared With Me
11. Open shared document

## 2:30--3:30 --- Engineering decisions

Mention:

-   Structured rich-text persistence
-   Backend authorization
-   Simulated users
-   Deliberate scope cuts

## 3:30--4:30 --- AI workflow

Explain:

-   AI helped decompose/scaffold/debug/review
-   You reviewed generated output
-   You rejected unnecessary complexity
-   You verified behavior manually and through tests

## Final

State what you would add with another 2--4 hours.

------------------------------------------------------------------------

# 18. Another 2--4 Hours Roadmap

Potential next steps:

1.  Production authentication
2.  Viewer/editor permissions
3.  Real-time collaboration
4.  Version history
5.  Comments
6.  DOCX import
7.  More comprehensive automated tests
8.  Improved accessibility
9.  Better observability
10. Richer deployment configuration

Do not implement these during the core timebox unless everything
required is already finished.

------------------------------------------------------------------------

# 19. Initial AI Coding Agent Prompt

Use this as the first implementation prompt:

> Build a time-boxed full-stack collaborative document editor using
> React + TypeScript for the frontend and Django REST Framework for the
> backend.
>
> The application must support creating, renaming, editing, saving and
> reopening rich-text documents; importing `.txt` and `.md` files as
> documents; simulated seeded users; document ownership; sharing
> documents with another seeded user; separate Owned and Shared With Me
> views; persistence; server-side access enforcement; validation/error
> handling; and at least one meaningful automated backend test for
> sharing authorization.
>
> Use TipTap for rich-text editing with bold, italic, underline,
> headings, bullet lists and numbered lists. Store editor structure so
> formatting survives reloads.
>
> Keep architecture intentionally simple for a four-hour technical
> assessment. Do not implement real-time collaboration, production
> authentication, comments, version history, DOCX parsing,
> microservices, Redux, or unnecessary abstractions.
>
> First inspect the repository and propose the minimal directory
> structure, data model, API contract, and implementation sequence. Do
> not implement anything until the plan is shown.

Review the agent's plan before allowing broad implementation.

------------------------------------------------------------------------

# 20. Definition of Done

The project is submission-ready when a reviewer can:

-   Open the live URL
-   Identify the active simulated user
-   Create a document
-   Rename it
-   Format content
-   Save it
-   Refresh/reopen without losing content or formatting
-   Import a supported file
-   Share a document
-   Switch users
-   See a clear distinction between owned/shared documents
-   Access a shared document
-   Observe sensible validation/error behavior

And the submission contains:

-   Source code
-   README
-   Architecture note
-   AI workflow note
-   SUBMISSION.md
-   Live deployment
-   At least one meaningful automated test
-   Walkthrough video
-   Reviewer instructions/credentials
-   Honest known limitations
-   Clear next-step roadmap

------------------------------------------------------------------------

# Final Principle

**Do not build Google Docs. Build a convincing, reliable product
slice.**

The strongest submission is not the one with the most features. It is
the one that demonstrates deliberate product decisions, full-stack
competence, reliable end-to-end behavior, mature AI usage, and the
ability to ship under a strict time constraint.

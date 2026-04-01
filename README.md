# StudyNest

A customizable digital study workspace for sustained focus, built on Attention Restoration Theory. Designed for usability testing as part of a UX research project.

## Getting started

```bash
npm install
npm run dev
```

## Features

**Session timer** — flexible focus/break durations (1–60 min focus, 1–20 min break). Timer counts down with a visual progress bar. When focus time ends, the session keeps running in overtime until you decide to stop or take a break. Break warning fires at 50% remaining (for breaks under 10 min) or 5 min remaining (for longer breaks), prompting you to pick your next task before the break ends.

**Tasks** — lightweight task list with priority and due date. Quick-add available directly from the session modal so you never have to leave the timer.

**Friends** — virtual study room with mock study mates showing focus/break status and a group chat for social accountability.

**Sounds** — ambient sound selector (rain, café, ocean, etc.) with volume control.

**Spaces** — background picker with a default gradient and support for uploading your own image.

All panels are draggable — open multiple at once and arrange them however you like.

## Stack

React + TypeScript, Vite, Tailwind CSS, Radix UI, Zustand (persisted state), Lucide icons.

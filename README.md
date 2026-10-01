# AZ Permit Practice

A dependency-free static web app for studying the public Arizona MVD driver-license sample questions.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Features

- 95 questions from the three public Arizona MVD practice tests
- Random 30-question tests with an 80% passing benchmark
- Complete result review with correct and incorrect answer highlighting
- One-question study mode with instant feedback and right/wrong counters
- Toggleable English and Vietnamese handbook-based explanations; incorrect answers open automatically
- Responsive, keyboard-friendly interface

Question diagrams are loaded from their original public `apps.azdot.gov` URLs. The app is an independent educational tool and is not affiliated with ADOT.

## Verify the answer bank

Run `node verify-answers.js`. The regression check covers all 95 entries: 30 image-based and 65 text-only questions.

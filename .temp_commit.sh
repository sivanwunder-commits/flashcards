#!/bin/bash
cd "/Users/sivanwunder/Documents/Coding Learning/Vibe Coding Course/flashcard"
git add .
git commit -m "fix: resolve TypeScript compilation errors for Vercel deployment

- Add AccuracyRecord interface for proper type safety
- Add missing studyStreaks and lastStudyDate to StatisticsSummary
- Fix accuracyByTense and accuracyByVerbType to use AccuracyRecord
- Prefix unused parameters with underscore to suppress warnings
- Remove unused updateStatistics method from studySessionManager
- Add timeSpent to StudySessionRecord interface

All TypeScript errors resolved, ready for deployment"
git push origin main


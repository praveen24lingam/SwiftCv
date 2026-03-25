#!/bin/bash
mkdir -p app/\(auth\)/login app/\(auth\)/signup app/\(dashboard\)/dashboard app/build app/templates app/learn app/api/ai app/api/resume app/api/score components/layout components/landing components/builder components/ats components/templates components/ui lib store types hooks

for d in app/\(auth\)/login app/\(auth\)/signup app/\(dashboard\)/dashboard app/build app/templates app/learn; do
  echo "export default function Page() { return <div>Page</div>; }" > "$d/page.tsx"
done

for d in app/api/ai app/api/resume app/api/score; do
  echo "import { NextResponse } from 'next/server'; export async function GET() { return NextResponse.json({}); }" > "$d/route.ts"
done

for f in components/layout/Navbar.tsx components/layout/Footer.tsx components/landing/Hero.tsx components/landing/Features.tsx components/landing/HowItWorks.tsx components/landing/Stats.tsx components/landing/CTA.tsx components/builder/ResumeForm.tsx components/builder/SectionEditor.tsx components/builder/LivePreview.tsx components/ats/ScoreWidget.tsx components/ats/ScoreBreakdown.tsx components/ats/ATSTips.tsx components/ats/JDMatcher.tsx components/templates/TemplateCard.tsx components/templates/TemplatePreview.tsx; do
  name=$(basename "$f" .tsx)
  echo "export function $name() { return <div>$name</div>; }" > "$f"
done

echo "export interface Resume {}" > types/resume.ts
echo "export const useResumeStore = () => {};" > store/useResumeStore.ts
echo "export const useATSScore = () => {};" > hooks/useATSScore.ts
touch lib/supabase.ts lib/supabase-server.ts lib/ats-scorer.ts lib/verb-checker.ts

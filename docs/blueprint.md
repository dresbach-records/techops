# **App Name**: TechAdvisory Platform

## Core Features:

- Landing Page with CTA: Informative landing page with a clear call to action to 'Start Technical Diagnostic'.
- Authentication Frontend: Login and registration screens with JWT token storage in cookie or localStorage.
- Dynamic Diagnostic Questionnaire: Multi-step questionnaire with dynamic questions, progress saving, and API submission. Redirect to payment after completion.
- Simulated Payment Confirmation: Payment confirmation screen with status fetched from API. Access to the dashboard only after successful payment.
- Client Dashboard: Dashboard layout with a sidebar, dynamically displaying modules based on API response.
- Access Control Guards: Frontend guards to restrict access based on payment status (questionnaire and payment for unpaid users, full dashboard access for paid users).

## Style Guidelines:

- Primary color: Dark blue (#1A237E) for professionalism and trust.
- Background color: Light gray (#F5F5F5) for a clean, modern look.
- Accent color: Electric purple (#7B1FA2) for highlights and calls to action.
- Body font: 'Inter' sans-serif for a modern, neutral feel in body text; Headline font: 'Space Grotesk' for headlines, with a techy, scientific feel. 
- Use clean, professional icons relevant to each module (e.g., a graph for diagnostics, a road for roadmap).
- Clean, organized layout with a focus on usability and a professional SaaS aesthetic.
- Subtle transitions and animations to enhance user experience (e.g., loading animations, menu transitions).
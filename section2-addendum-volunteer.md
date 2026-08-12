# Proposed addition to Section 2 — Volunteer Applications

The volunteer registration form on `/contact` (ContactPage.js) has no matching
endpoint in the current contract — it's a much richer form than the simple
`/contact-submissions` submission (name, email, phone, city, message) and
collects DOB, gender, occupation, address, areas of interest, availability,
hours/week, prior experience, motivation, and skills.

Proposed new section for the contract doc, to confirm with backend before wiring:

### 2.14 Volunteer Applications

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | `/volunteer-applications` | none | see fields below |
| GET | `/volunteer-applications` | admin | list, filterable |

Body:
```json
{
  "email": "string, required",
  "fullName": "string, required",
  "parentName": "string, required",
  "dob": "date, required",
  "gender": "Male | Female | Prefer not to say | Other, required",
  "mobile": "string, required",
  "address": "string, required",
  "cityState": "string, required",
  "occupation": "Student | Working Professional | Self-employed | Other, required",
  "areasOfInterest": "string[], required (at least one)",
  "preferredMode": "Online | Offline | Both, required",
  "availability": "Weekdays | Weekends | Flexible, required",
  "hoursPerWeek": "number, required",
  "hasPriorExperience": "boolean, required",
  "priorExperienceDetails": "string, optional",
  "motivation": "string, optional",
  "skills": "string, optional"
}
```

Suggest also adding an admin dashboard stat card for pending volunteer
applications, similar to the certificate-requests count on /admin.

**Please review with backend and confirm the field names/enums before I wire
the ContactPage volunteer form to it — I'll hold off on that piece of Phase 2
until this is added to Section 2.**

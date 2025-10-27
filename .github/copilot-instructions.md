# PEA Forms App - AI Coding Agent Instructions

## Project Overview
Next.js 15 app for Provincial Electricity Authority (PEA) inspection forms. Supports 6 form types: home, condo, construction, EV charger (LV/HV), and other inspections. Forms generate PDFs using `@react-pdf/renderer` with Thai language support (Sarabun font).

## Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack dev mode)
- **Languages**: JavaScript (90%), TypeScript (10%)
- **Database**: Supabase (PostgreSQL with `@supabase/ssr`)
- **UI**: Tailwind CSS 4, React 19, Headless UI
- **PDF**: @react-pdf/renderer with custom Thai fonts
- **Maps**: Leaflet + react-leaflet for location selection
- **Forms**: react-hook-form with custom validation

## Critical Architecture Patterns

### Form System Architecture
Each form type follows a **schema-driven pattern**:
1. **Schema** (`lib/constants/{formType}FormSchema.js`) - single source of truth for form structure
2. **Form Component** (`app/form/{formType}/{formType}form.jsx`) - uses schema sections
3. **Section Components** (`app/form/components/{category}/`) - reusable UI sections
4. **API Route** - dynamic route at `/api/submit-form/[formType]` maps form types to tables
5. **PDF Component** (`components/pdf/{FormType}PDF.jsx`) - mirrors form structure

**Table name mapping** (API route):
```javascript
const tableMap = {
  "home-inspection": "home_inspection_forms",
  "condo-inspection": "condo_inspection_forms",
  "construction-inspection": "construction_inspection",
  "ev-charger-lv-inspection": "ev_charger_lv_inspection",
  "ev-charger-hv-inspection": "ev_charger_hv_inspection",
  "other-inspection": "other_inspection_forms"
};
```

### useFormManager Hook - The Core
`lib/hooks/useFormManager.js` is the central state manager. **Must pass these parameters**:
- `tableName`: Supabase table name
- `initialFormData`: Schema reference
- `arrayFields`: Array of field names that store arrays (e.g., `['items', 'checklist']`)
- `numericFields`: Fields requiring numeric conversion (e.g., `['load', 'latitude', 'longitude']`)
- `bucketName`: Default is `'form-images'`

**Critical**: Array field handling depends on your PostgreSQL column type:
- JSONB columns: Hook stringifies arrays automatically
- ARRAY columns: Send arrays directly (current implementation)

### Supabase Client Pattern
Three client types - **use the correct one**:
- `lib/supabase/client.js`: Browser client (`createBrowserClient`) - use in Client Components
- `lib/supabase/server.ts`: Server client - use in Server Components/Actions
- `middleware.ts`: SSR client - handles auth state in middleware

### Authentication Flow
**Middleware** (`middleware.ts`) enforces auth:
- Unauthenticated users → redirect to `/auth/login`
- Authenticated users accessing `/auth/*` → redirect to `/dashboard`
- Protected routes: everything except `/auth/*`

## File Structure Conventions

### Form Component Organization
```
app/form/{form-type}/
  page.jsx                    # Minimal wrapper, imports form
  {form-type}form.jsx         # Main form logic, uses useFormManager
  edit/[id]/page.jsx          # Edit mode with id from URL params

app/form/components/
  {category}/                 # Group by form type (home, condo, evCharger, etc.)
    {Section}Section.jsx      # Reusable section components
  shared/                     # Cross-form components (signature, summary, etc.)
```

### Schema Location
All schemas in `lib/constants/{formType}FormSchema.js`. Structure mirrors database columns.

## Development Workflow

### Running the App
```bash
npm run dev     # Uses --turbopack flag (Next.js 15 default)
npm run build   # Production build
npm run start   # Production server
```

### Environment Setup
Required `.env.local` variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For API routes only
```

### Database Schema Requirements
Each form table must include:
- `id` (primary key)
- `user_id` (uuid, foreign key to auth.users)
- `created_at`, `updated_at` (timestamps)
- Form-specific fields matching schema structure

**Supabase Storage**: Create `form-images` bucket with public read access. Next.js config already allows images from `cznbhkepfkhisdknayce.supabase.co/storage/v1/object/public/form-images/**`

## Key Patterns & Conventions

### Image Upload Pattern
Use `components/forms/ImageUpload.jsx`:
- Supports file upload OR camera capture
- Returns File object to parent component
- Parent handles Supabase upload via `useFormManager.uploadImage(file)`
- Stores public URLs in database (not file objects)

### PDF Generation Pattern
All PDF components use `@react-pdf/renderer`:
1. Register Thai font (`Sarabun`) from `/public/fonts/`
2. Use custom `Checkbox` component (SVG-based) - don't use HTML
3. Mirror form schema sections exactly
4. Handle null/undefined values defensively

Example PDF generation:
```javascript
import { pdf } from '@react-pdf/renderer';
const blob = await pdf(<FormPDF formData={data} />).toBlob();
// Then create download link
```

### Shared Components
- `InspectionSummarySection`: Standard 3-option radio (complete/incomplete_minor/incomplete_reject)
- `SignaturePadSection`: Uses `react-signature-canvas`, saves as base64 data URL
- `OpenStreetMapComponent`: Leaflet map with search, returns lat/lng

### Thai Language & Styling
- Primary font: Kanit (from Google Fonts, loaded in `app/layout.tsx`)
- All UI text in Thai, including README
- Gradient background: `from-purple-100 via-purple-50 to-indigo-100`
- Toast notifications via `sonner` library

## Common Pitfalls

1. **Array fields not displaying**: Check if you added field name to `arrayFields` param in `useFormManager`
2. **Numeric fields as strings**: Add to `numericFields` array or use field name patterns (latitude, longitude, load, etc.)
3. **PDF not rendering Thai text**: Ensure Sarabun font is registered and files exist in `/public/fonts/`
4. **Images not loading**: Verify `next.config.ts` hostname matches your Supabase project URL
5. **Auth redirect loops**: Check middleware logic - ensure your route starts with `/auth/` for public access

## Adding a New Form Type

1. Create schema in `lib/constants/{newType}FormSchema.js`
2. Add table mapping in `app/api/submit-form/[formType]/route.js`
3. Create form component in `app/form/{new-type}/`
4. Create section components in `app/form/components/{newType}/`
5. Create PDF component in `components/pdf/{NewType}PDF.jsx`
6. Create Supabase table with matching schema
7. Add navigation link in `components/ui/Navbar.tsx`

## Testing & Debugging
- No test suite configured - manual testing only
- Use browser DevTools Network tab to inspect Supabase requests
- Check Supabase dashboard for table structure and RLS policies
- PDF issues: Log `formData` object before passing to PDF component
- Form not saving: Verify table name mapping and schema match database columns

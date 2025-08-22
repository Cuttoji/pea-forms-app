import { Suspense } from 'react';

// Create a wrapper component for the form content
function CommercialInspectionFormContent() {
  // ...existing code with useSearchParams...
}

// Loading component
function FormLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Main page component with Suspense
export default function CommercialInspectionPage() {
  return (
    <Suspense fallback={<FormLoading />}>
      <CommercialInspectionFormContent />
    </Suspense>
  );
}

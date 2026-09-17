"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HomeContent from "../HomeContent";

function PreviewContent() {
  const searchParams = useSearchParams();

  const title =
    searchParams.get("title") || "Protecting Rights & Hope.";

  return (
    <div className="preview-mode">
      <HomeContent customTitle={title} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
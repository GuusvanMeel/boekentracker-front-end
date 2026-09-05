"use client";

import { Suspense } from "react";
import { Layout } from "./components/Layout";
import { CurrentBooks } from "./components/CurrentBooks";
import { SpinWheel } from "./components/SpinWheel";
import { ReadingCalendar } from "./components/ReadingCalendar";

export default function HomePage() {
  return (
    <Layout title="Leeslijst">
      <CurrentBooks />
      <SpinWheel />

      <Suspense fallback={null}>
        <ReadingCalendar />
      </Suspense>
    </Layout>
  );
}
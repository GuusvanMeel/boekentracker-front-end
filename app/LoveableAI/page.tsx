"use client";

import { Layout } from './components/Layout';
import { CurrentBooks } from './components/CurrentBooks';
import { SpinWheel } from './components/SpinWheel';
import { ReadingCalendar } from './components/ReadingCalendar';

export default function HomePage() {
  return (
    <Layout title="Leeslijst">
      <CurrentBooks />
      <SpinWheel />
      <ReadingCalendar />
    </Layout>
  );
}

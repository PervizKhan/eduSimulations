import React from 'react';
import { notFound } from 'next/navigation';
import SimulationWrapper from '@/components/SimulationWrapper';
import SimulationRenderer from '@/components/SimulationRenderer';

const simulationsRegistry = {
  '3d-projectile': require('@/config/simulations/3d-projectile.json'),
};

export async function generateStaticParams() {
  return Object.keys(simulationsRegistry).map((slug) => ({ slug }));
}

export default async function SimulationPage({ params }) {
  const { slug } = await params;
  const config = simulationsRegistry[slug];

  if (!config) {
    notFound();
  }

  return (
    <SimulationWrapper config={config}>
      {/* Handing over slug matching to the client side renderer */}
      <SimulationRenderer slug={slug} />
    </SimulationWrapper>
  );
}
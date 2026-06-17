import React from 'react';
import { notFound } from 'next/navigation';
import SimulationWrapper from '@/components/SimulationWrapper';
import SimulationRenderer from '@/components/SimulationRenderer';

// Registry: Add new simulations here
const simulationsRegistry = {
  '3d-projectile': require('@/config/simulations/3d-projectile.json'),
  'logic-gates': require('@/config/simulations/logic-gates.json'),
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
      <SimulationRenderer slug={slug} />
    </SimulationWrapper>
  );
}
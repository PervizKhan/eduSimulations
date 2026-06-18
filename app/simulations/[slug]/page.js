import SimulationWrapper from '@/components/SimulationWrapper';
import SimulationRenderer from '@/components/SimulationRenderer';
import fs from 'fs';
import path from 'path';

// ===== GET SIMULATION CONFIG =====
async function getSimulationConfig(slug) {
  try {
    const configPath = path.join(process.cwd(), 'config/simulations', `${slug}.json`);
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

// ===== GENERATE STATIC PATHS =====
export async function generateStaticParams() {
  try {
    const configDir = path.join(process.cwd(), 'config/simulations');
    const files = fs.readdirSync(configDir);
    
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        slug: file.replace('.json', '')
      }));
  } catch (error) {
    return [];
  }
}

// ===== PAGE COMPONENT =====
export default async function SimulationPage({ params }) {
  const { slug } = await params;
  const config = await getSimulationConfig(slug);
  
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400">❌ Simulation Not Found</h1>
          <p className="text-slate-400 mt-2">
            The simulation &quot;{slug}&quot; does not exist.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <SimulationWrapper config={config}>
      <SimulationRenderer slug={slug} />
    </SimulationWrapper>
  );
}
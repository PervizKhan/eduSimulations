import fs from 'fs/promises';
import path from 'path';

const CONFIG_DIR = path.join(process.cwd(), 'config/simulations');

export async function getSimulationConfig(slug) {
  try {
    const filePath = path.join(CONFIG_DIR, `${slug}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

export async function getAllSimulationSlugs() {
  try {
    const files = await fs.readdir(CONFIG_DIR);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  } catch (error) {
    return [];
  }
}

// Premium check utility - metadata driven
export function isPremiumSimulation(config) {
  return config.isPremium === true;
}
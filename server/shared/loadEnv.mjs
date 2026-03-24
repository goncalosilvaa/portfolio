import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..');
const envFiles = ['.env.local', '.env'];

export function loadLocalEnv() {
  if (typeof process.loadEnvFile !== 'function') {
    return [];
  }

  return envFiles.reduce((loadedFiles, fileName) => {
    const filePath = path.join(rootDir, fileName);

    if (existsSync(filePath)) {
      process.loadEnvFile(filePath);
      loadedFiles.push(filePath);
    }

    return loadedFiles;
  }, []);
}

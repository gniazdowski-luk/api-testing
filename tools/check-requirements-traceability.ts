import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const REQUIREMENTS_DIR = path.join(ROOT_DIR, 'requirements');
const TESTS_DIR = path.join(ROOT_DIR, 'tests');

function walkDir(dirPath: string, fileFilter: (filePath: string) => boolean = () => true): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, fileFilter));
      continue;
    }
    if (fileFilter(fullPath)) {
      results.push(fullPath);
    }
  }

  return results;
}

function normalizeTestName(rawName: string): string {
  return rawName.replace(/\s+@\S+/g, '').trim();
}

function stripMarkdownComments(content: string): string {
  return content.replace(/<!--[\s\S]*?-->/g, '');
}

function stripTypeScriptComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
}

function parseRequirementNames(filePath: string): string[] {
  const content = stripMarkdownComments(fs.readFileSync(filePath, 'utf8'));
  const names: string[] = [];
  const regex = /^\s*-\s*`([^`]+)`\s*-\s*.+$/gm;

  for (const match of content.matchAll(regex)) {
    names.push(match[1].trim());
  }

  return names;
}

function parseTestNames(filePath: string): string[] {
  const content = stripTypeScriptComments(fs.readFileSync(filePath, 'utf8'));
  const names: string[] = [];
  const regex = /\btest(?:\.(?:only|skip|fixme))?\(\s*(['"`])([\s\S]*?)\1\s*,/gm;

  for (const match of content.matchAll(regex)) {
    const rawTitle = match[2].trim();
    names.push(normalizeTestName(rawTitle));
  }

  return names;
}

function _formatList(title: string, items: string[]): string {
  if (!items.length) return '';
  return `${title}\n${items.map((item) => `- ${item}`).join('\n')}`;
}

function main(): void {
  const requirementFiles = walkDir(REQUIREMENTS_DIR, (filePath) => path.extname(filePath).toLowerCase() === '.md');
  const testFiles = walkDir(TESTS_DIR, (filePath) => filePath.endsWith('.spec.ts'));

  const requirementCounts = new Map<string, number>();
  for (const requirementFile of requirementFiles) {
    for (const requirementName of parseRequirementNames(requirementFile)) {
      requirementCounts.set(requirementName, (requirementCounts.get(requirementName) || 0) + 1);
    }
  }

  const testCounts = new Map<string, number>();
  for (const testFile of testFiles) {
    for (const testName of parseTestNames(testFile)) {
      testCounts.set(testName, (testCounts.get(testName) || 0) + 1);
    }
  }

  const duplicateRequirementNames = [...requirementCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([name, count]) => `${name} (x${count})`)
    .sort();

  const requirementsWithoutTests = [...requirementCounts.keys()].filter((name) => !testCounts.has(name)).sort();

  const testsWithoutRequirements = [...testCounts.keys()].filter((name) => !requirementCounts.has(name)).sort();

  const hasErrors =
    duplicateRequirementNames.length > 0 || requirementsWithoutTests.length > 0 || testsWithoutRequirements.length > 0;

  if (!hasErrors) {
    process.stdout.write('Requirements traceability check passed.\n');
    return;
  }

  if (duplicateRequirementNames.length > 0) {
    process.stderr.write(`${formatList('Duplicate requirement names found:', duplicateRequirementNames)}\n`);
  }

  if (requirementsWithoutTests.length > 0) {
    process.stderr.write(`${formatList('Requirements without matching tests:', requirementsWithoutTests)}\n`);
  }

  if (testsWithoutRequirements.length > 0) {
    process.stderr.write(`${formatList('Tests without matching requirements:', testsWithoutRequirements)}\n`);
  }

  process.exit(1);
}

main();

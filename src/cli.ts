import {parseArgs} from 'node:util';
import {basename, dirname, extname, relative, resolve, sep} from 'node:path';
import {existsSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {lint, normalizeSettings} from './headless';
import type {LinterSettings} from './settings-data';
import {parseCustomReplacements} from './utils/strings';

const defaultConfigPath = '.obsidian/plugins/obsidian-linter/data.json';

type CliValues = {
  check?: boolean;
  config?: string;
  help?: boolean;
  write?: boolean;
};

function print(message: string): void {
  process.stdout.write(`${message}\n`);
}

function printError(message: string): void {
  process.stderr.write(`${message}\n`);
}

function loadDefaultMisspellings(): Map<string, string> {
  const misspellingsPath = resolve(dirname(fileURLToPath(import.meta.url)), 'utils/default-misspellings.md');

  return existsSync(misspellingsPath)
    ? parseCustomReplacements(readFileSync(misspellingsPath, 'utf8'))
    : new Map<string, string>();
}

function usage(): string {
  return `Usage: bun src/cli.ts (--check | --write) [--config path] <file...>

  --check          Report files that would change without writing them
  --write          Apply linted content to changed files
  --config path    Obsidian Linter data.json to load
  --help           Show this help

Default config: ${defaultConfigPath} relative to the current directory.
`;
}

function loadSettings(configPath: string): LinterSettings {
  return normalizeSettings(JSON.parse(readFileSync(configPath, 'utf8')) as unknown);
}

function lintFile(filePath: string, settings: LinterSettings, currentTime: Date, defaultMisspellings: Map<string, string>): [string, string, string] {
  const absolutePath = resolve(filePath);
  const stat = statSync(absolutePath);
  const text = readFileSync(absolutePath, 'utf8');
  const displayPath = relative(process.cwd(), absolutePath).split(sep).join('/') || basename(absolutePath);
  const name = basename(absolutePath, extname(absolutePath));
  const locale = settings.linterLocale === 'system-default' ? 'en' : settings.linterLocale;

  return [displayPath, text, lint({
    text,
    path: displayPath,
    name,
    createdAt: stat.birthtime,
    modifiedAt: stat.mtime,
    currentTime,
    locale,
    settings,
    defaultMisspellings,
  })];
}

export function main(argv: string[] = process.argv.slice(2)): number {
  let values: CliValues;
  let positionals: string[];
  try {
    ({values, positionals} = parseArgs({
      args: argv,
      options: {
        check: {type: 'boolean'},
        config: {type: 'string', short: 'c'},
        help: {type: 'boolean', short: 'h'},
        write: {type: 'boolean'},
      },
      allowPositionals: true,
      strict: true,
    }));
  } catch (error) {
    printError(`error: ${error instanceof Error ? error.message : String(error)}`);
    printError(usage());
    return 2;
  }

  if (values.help) {
    print(usage());
    return 0;
  }

  if (Boolean(values.check) === Boolean(values.write)) {
    printError('error: choose exactly one of --check or --write');
    return 2;
  }
  if (positionals.length === 0) {
    printError('error: at least one Markdown file is required');
    return 2;
  }

  const configPath = resolve(values.config ?? defaultConfigPath);
  let settings: LinterSettings;
  try {
    settings = loadSettings(configPath);
  } catch (error) {
    printError(`error: unable to load config '${configPath}': ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }

  const currentTime = new Date();
  const defaultMisspellings = loadDefaultMisspellings();
  let changed = false;
  for (const filePath of positionals) {
    try {
      const [displayPath, original, output] = lintFile(filePath, settings, currentTime, defaultMisspellings);
      const absolutePath = resolve(filePath);
      if (output === original) {
        print(`unchanged: ${displayPath}`);
        continue;
      }

      changed = true;
      if (values.write) {
        writeFileSync(absolutePath, output, 'utf8');
        print(`updated: ${displayPath}`);
      } else {
        print(`would change: ${displayPath}`);
      }
    } catch (error) {
      printError(`error: ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
      return 2;
    }
  }

  return values.check && changed ? 1 : 0;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}

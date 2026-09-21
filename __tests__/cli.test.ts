import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const repositoryPath = process.cwd();
const configPath = join(repositoryPath, 'test-vault/.obsidian/plugins/obsidian-linter/data.json');

function runCli(args: string[]) {
  return spawnSync('bun', ['src/cli.ts', ...args], {
    cwd: repositoryPath,
    encoding: 'utf8',
  });
}

describe('headless lint CLI', () => {
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'obsidian-linter-cli-'));
  });

  afterEach(() => {
    rmSync(directory, {recursive: true, force: true});
  });

  test('check reports changes without writing', () => {
    const filePath = join(directory, 'note.md');
    const before = 'before\n\n\n after\n';
    writeFileSync(filePath, before);

    const result = runCli(['--check', '--config', configPath, filePath]);

    expect(result.status).toBe(1);
    expect(result.stdout).toContain('would change:');
    expect(readFileSync(filePath, 'utf8')).toBe(before);
  });

  test('write changes only files whose linted output differs', () => {
    const changedPath = join(directory, 'changed.md');
    const unchangedPath = join(directory, 'unchanged.md');
    writeFileSync(changedPath, 'before\n\n\n after\n');
    writeFileSync(unchangedPath, 'before\n\nafter\n');

    const result = runCli(['--write', '--config', configPath, changedPath, unchangedPath]);

    expect(result.status).toBe(0);
    expect(readFileSync(changedPath, 'utf8')).toBe('before\n\n after\n');
    expect(readFileSync(unchangedPath, 'utf8')).toBe('before\n\nafter\n');
    expect(result.stdout).toContain('updated:');
    expect(result.stdout).toContain('unchanged:');

    const firstPass = readFileSync(changedPath);
    const secondResult = runCli(['--write', '--config', configPath, changedPath]);

    expect(secondResult.status).toBe(0);
    expect(secondResult.stdout).toContain('unchanged:');
    expect(readFileSync(changedPath)).toEqual(firstPass);
  });

  test('handles a large CRLF and Unicode batch without changing ignored sections', () => {
    const filePaths = Array.from({length: 32}, (_, index) => join(directory, `note-${index}.md`));
    const repeated = Array.from({length: 128}, (_, line) => `line ${line} — 日本語`).join('\r\n');
    const inputFor = (index: number) => `${repeated}\r\n\r\n\r\n<!-- linter-disable -->\r\nignored ${index}\r\n\r\n\r\n<!-- linter-enable -->\r\n`;
    const inputs = new Map(filePaths.map((filePath, index) => {
      const input = inputFor(index);
      writeFileSync(filePath, input, 'utf8');
      return [filePath, input];
    }));
    const cliArgs = (mode: '--check' | '--write') => [mode, '--config', configPath, ...filePaths];

    const check = runCli(cliArgs('--check'));

    expect(check.status).toBe(1);
    expect(check.stdout.trim().split('\n')).toHaveLength(filePaths.length);
    for (const [filePath, input] of inputs) {
      expect(readFileSync(filePath, 'utf8')).toBe(input);
    }

    const write = runCli(cliArgs('--write'));

    expect(write.status).toBe(0);
    expect(write.stdout.trim().split('\n')).toHaveLength(filePaths.length);
    for (const [filePath, input] of inputs) {
      const output = readFileSync(filePath, 'utf8');
      const index = filePath.match(/note-(\d+)\.md$/)?.[1];

      expect(output).not.toBe(input);
      expect(output).toContain('日本語');
      expect(output).toContain(`<!-- linter-disable -->\nignored ${index}\n\n\n<!-- linter-enable -->`);
      expect(output).not.toContain('\r');
    }

    const secondCheck = runCli(cliArgs('--check'));

    expect(secondCheck.status).toBe(0);
    expect(secondCheck.stdout.trim().split('\n')).toHaveLength(filePaths.length);
    expect(secondCheck.stdout).not.toContain('would change:');
  });

  test('returns an error for missing files and documents the default config', () => {
    const missingPath = join(directory, 'missing.md');
    const result = runCli(['--check', '--config', configPath, missingPath]);

    expect(result.status).toBe(2);
    expect(result.stderr).toContain(`error: ${missingPath}:`);

    const missingConfig = runCli(['--check', missingPath]);
    expect(missingConfig.status).toBe(2);
    expect(missingConfig.stderr).toContain('unable to load config');

    const help = runCli(['--help']);
    expect(help.status).toBe(0);
    expect(help.stdout).toContain('.obsidian/plugins/obsidian-linter/data.json');
  });
});

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {lint, normalizeSettings} from '../src/headless';
import {rules} from '../src/rules';
import {DEFAULT_SETTINGS, LinterSettings} from '../src/settings-data';

function settingsWithOnly(ruleAlias: string): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  settings.ruleConfigs = {};

  for (const rule of rules) {
    settings.ruleConfigs[rule.alias] = {...rule.getDefaultOptions(), enabled: rule.alias === ruleAlias};
  }

  settings.logLevel = 'ERROR';
  return settings;
}

function settingsWithRules(enabledRules: Record<string, Record<string, unknown>>): LinterSettings {
  const settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)) as LinterSettings;
  settings.ruleConfigs = {};

  for (const rule of rules) {
    settings.ruleConfigs[rule.settingsKey] = {
      ...rule.getDefaultOptions(),
      enabled: Object.hasOwn(enabledRules, rule.alias),
      ...(enabledRules[rule.alias] ?? {}),
    };
  }

  settings.logLevel = 'ERROR';
  return settings;
}

function lintFixture(text: string, settings: LinterSettings): string {
  return lint({
    text,
    path: 'headless/representative.md',
    name: 'representative',
    createdAt: '2026-09-21T10:00:00Z',
    modifiedAt: '2026-09-21T10:00:00Z',
    currentTime: '2026-09-21T10:00:00Z',
    locale: 'en',
    settings,
  });
}

test('lints through the registered rules without loading Obsidian', () => {
  const output = lint({
    text: '# Heading',
    path: 'notes/example.md',
    name: 'example',
    createdAt: '2026-09-21T10:00:00Z',
    modifiedAt: '2026-09-21T10:00:00Z',
    currentTime: '2026-09-21T10:00:00Z',
    locale: 'en',
    settings: settingsWithOnly('line-break-at-document-end'),
  });

  expect(output).toBe('# Heading\n');
});

test('normalizes a partial Obsidian policy before linting', () => {
  const settings = normalizeSettings({
    linterLocale: 'en',
    ruleConfigs: {'line-break-at-document-end': {enabled: true}},
  });

  expect(lintFixture('# Heading', settings)).toBe('# Heading\n');
});

test('matches the representative fixture and is idempotent', () => {
  const fixturePath = join(process.cwd(), 'test-vault/headless/representative.md');
  const expectedPath = join(process.cwd(), 'test-vault/headless/representative.linted.md');
  const settings = settingsWithRules({
    'yaml-key-sort': {
      enabled: true,
      'priority-keys-at-start-of-yaml': false,
      'yaml-sort-order-for-other-keys': 'Ascending Alphabetical',
    },
    'yaml-timestamp': {
      enabled: true,
      'date-created-key': 'created',
      'date-modified-key': 'modified',
      format: 'YYYY-MM-DD',
    },
    'heading-blank-lines': {enabled: true},
    'remove-trailing-punctuation-in-heading': {enabled: true},
    'space-after-list-markers': {enabled: true},
    'remove-multiple-spaces': {enabled: true},
    'remove-link-spacing': {enabled: true},
    'footnote-after-punctuation': {enabled: true},
    're-index-footnotes': {enabled: true},
    'empty-line-around-code-fences': {enabled: true},
    'empty-line-around-math-blocks': {enabled: true},
    'empty-line-around-tables': {enabled: true},
    'empty-line-around-blockquotes': {enabled: true},
    'consecutive-blank-lines': {enabled: true},
    'line-break-at-document-end': {enabled: true},
    'no-bare-urls': {enabled: true},
    'proper-ellipsis': {enabled: true},
    'convert-bullet-list-markers': {enabled: true},
  });
  const once = lintFixture(readFileSync(fixturePath, 'utf8'), settings);

  expect(once).toBe(readFileSync(expectedPath, 'utf8'));
  expect(lintFixture(once, settings)).toBe(once);
});

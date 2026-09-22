import moment from 'moment';
import type {Moment} from 'moment';
import {RulesRunner} from './rules-runner';
import type {LinterSettings} from './settings-data';
import {DEFAULT_SETTINGS} from './settings-data';
import './headless-rules-registry';
import {setLanguage} from './lang/helpers';
import {rules, sortRules} from './rules';
import {stripCr} from './utils/strings';

export {DEFAULT_SETTINGS} from './settings-data';
export type {LinterSettings} from './settings-data';

export type HeadlessLintOptions = {
  text: string;
  path: string;
  name: string;
  createdAt: string | number | Date | Moment;
  modifiedAt: string | number | Date | Moment;
  currentTime: string | number | Date | Moment;
  locale: string;
  settings: LinterSettings;
  defaultMisspellings?: Map<string, string>;
};

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Normalize an Obsidian Linter data.json policy with the CLI's rule defaults. */
export function normalizeSettings(raw: unknown): LinterSettings {
  if (!isJsonObject(raw)) throw new Error('configuration must contain a JSON object');

  const rawRuleConfigs = raw.ruleConfigs ?? {};
  if (!isJsonObject(rawRuleConfigs)) {
    throw new Error('configuration ruleConfigs must be a JSON object');
  }
  const rawCommonStyles = raw.commonStyles;
  if (rawCommonStyles !== undefined && !isJsonObject(rawCommonStyles)) {
    throw new Error('configuration commonStyles must be a JSON object');
  }
  const commonStyles = isJsonObject(rawCommonStyles) ? rawCommonStyles : {};

  const settings = {
    ...DEFAULT_SETTINGS,
    ...raw,
    commonStyles: {...DEFAULT_SETTINGS.commonStyles, ...commonStyles},
    ruleConfigs: {},
  } as LinterSettings;

  for (const rule of rules) {
    const configuredOptions = rawRuleConfigs[rule.settingsKey] ?? {};
    if (!isJsonObject(configuredOptions)) {
      throw new Error(`configuration for rule '${rule.settingsKey}' must be a JSON object`);
    }
    settings.ruleConfigs[rule.settingsKey] = {...rule.getDefaultOptions(), ...configuredOptions};
  }

  return settings;
}

function formatTimestamp(value: HeadlessLintOptions['createdAt'], locale: string): string {
  return moment(value).locale(locale).format();
}

export function lint(options: HeadlessLintOptions): string {
  sortRules();
  setLanguage(options.locale);

  const runner = new RulesRunner();
  const createdAtFormatted = formatTimestamp(options.createdAt, options.locale);
  const modifiedAtFormatted = formatTimestamp(options.modifiedAt, options.locale);

  return runner.lintText({
    oldText: stripCr(options.text),
    fileInfo: {
      name: options.name,
      path: options.path,
      createdAtFormatted,
      modifiedAtFormatted,
    },
    settings: options.settings,
    momentLocale: options.locale,
    getCurrentTime: () => moment(options.currentTime).locale(options.locale),
    defaultMisspellings: options.defaultMisspellings ?? new Map<string, string>(),
  });
}

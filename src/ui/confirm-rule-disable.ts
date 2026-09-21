import type {App} from 'obsidian';
import type {LanguageStringKey} from '../lang/helpers';

export function openConfirmRuleDisableModal(
    app: App,
    ruleBeingEnabledName: LanguageStringKey,
    ruleBeingDisabledName: LanguageStringKey,
    btnSubmitAction: () => Promise<void>,
    btnCancelAction: () => Promise<void>,
): void {
  void import('./modals/confirm-rule-disable-modal').then(({ConfirmRuleDisableModal}) => {
    new ConfirmRuleDisableModal(app, ruleBeingEnabledName, ruleBeingDisabledName, btnSubmitAction, btnCancelAction).open();
  });
}

import { Component } from 'react';
import { BodyProps } from '../Body';
import SettingItem from './SettingItem/SettingItem';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import { pageList } from '../../../page';
import { deleteUser, User } from 'firebase/auth';
import { firebaseAuth } from '../../../firebase/firebase';
import { JsonApi, JsonApiRequest, JsonApiRequestActionKind } from '../../../jsonapi';
import Localization from '../../../localization';
import './Settings.css';

const tosUrl = '/privacypolicy';
const privacyPolicyUrl = '/tos';
const licenseUrl = '/license';

export enum Language {
    EnglishUs,
    Japanese,
    JapaneseKana,
}

export function languageToStringName(lang: Language): string {
    switch (lang) {
        case Language.EnglishUs:
        return 'English (US)';

        case Language.Japanese:
        return '日本語';

        case Language.JapaneseKana:
        return 'にほんご';
    }
}

export enum Font {
    HpSimplified,
}

export function fontNameToString(font: Font): string {
    switch (font) {
        case Font.HpSimplified:
        return 'HP Simplified';
    }
}

export type SettingValues = {
    language: Language,
    font: Font,
};

export enum SettingValueKey {
    Language = 'language',
    Font = 'font',
}

function searchSettingValuesByKey(settingKey: SettingValueKey): number | null {
    const settingKeyString = `settings_${settingKey}`;
    const cookiePairs = document.cookie.split('; ');
    let settingValue: number | null = null;

    cookiePairs.some((eachPair: string) => {
        const [key, value] = eachPair.split('=');

        if (key === settingKeyString) {
            const parsingResult = Number(decodeURIComponent(value));
            settingValue = parsingResult !== NaN ? parsingResult : null;
            return true;
        }

        return false;
    });

    return settingValue;
}

function loadSettingValuesFromCookie(): SettingValues {
    const language = searchSettingValuesByKey(SettingValueKey.Language) as Language;
    const font = searchSettingValuesByKey(SettingValueKey.Font) as Font;

    return {
        language: language !== null ? language : Language.Japanese,
        font: font !== null ? font : Font.HpSimplified,
    }
}

function saveSettingValuesToCookie(settingValues: SettingValues) {
    const pairs: {
        [index: string]: string,
    } = {
        'language': `${settingValues.language}`,
        'font': `${settingValues.font}`,
    };

    Object.entries(pairs).forEach((eachPair: [string, string]) => {
        const [key, value] = eachPair;
        document.cookie = `settings_${key}=${encodeURIComponent(value)}`;
    });
}

class Settings extends Component<BodyProps> {
    private _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);
        this._isMounted = false;
        UiStore.addListener(this.onUpdateUiState.bind(this));
        AppDispatcher.dispatch(UiActionCreators.updateSettingValues(loadSettingValuesFromCookie()));
    }

    render() {
        const uiState = UiStore.getState();

        return (
            <div className="Settings body-component" id={this.props.page.name} style={this.props.style}>
                <div className="settings">
                    <div className="settings-group">
                        <div className="settings-group-title">
                            {Localization.getMessage('setting.group.display')}
                        </div>
                        <div className="settings-group-items">
                            <SettingItem itemName={Localization.getMessage('setting.item.languages')} itemValue={languageToStringName(uiState.settingValues.language)} onClickItem={this.onClickLanguageSettingItem}/>
                            <SettingItem itemName={Localization.getMessage('setting.item.fonts')} itemValue={fontNameToString(uiState.settingValues.font)} onClickItem={this.onClickFontSettingItem}/>
                        </div>
                    </div>
                    <div className="settings-group">
                        <div className="settings-group-title">
                            {Localization.getMessage('setting.group.terms')}
                        </div>
                        <div className="settings-group-items">
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.tos')} onClickItem={this.onClickTosItem}/>
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.privacy_policy')} onClickItem={this.onClickPrivacyPolicyItem}/>
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.licenses')} onClickItem={this.onClickLicenseItem}/>
                        </div>
                    </div>
                    <div className="settings-group">
                        <div className="settings-group-title">
                            {Localization.getMessage('setting.group.account')}
                        </div>
                        <div className="settings-group-items">
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.signout')} onClickItem={this.onClickSignoutItem}/>
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.suspension_of_use')} onClickItem={this.onClickSuspensionItem}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onClickLanguageSettingItem() {
        const uiState = UiStore.getState();
        const focusedListItemIndex = uiState.settingValues.language;
        let callbacks: {
            [name: string]: () => void;
        } = {};

        Object.entries(Language).forEach(([_index, eachLang]) => {
            const assertedLang = eachLang as Language;

            if (typeof assertedLang === 'number') {
                callbacks[languageToStringName(assertedLang)] = () => {
                    Settings.updateLanguageSettingTo(assertedLang);
                }
            }
        });

        AppDispatcher.dispatch(UiActionCreators.updateSettingValueList(focusedListItemIndex, callbacks));
        Settings.switchToSettingValueListPage();
    }

    static updateLanguageSettingTo(language: Language) {
        const values = UiStore.getState().settingValues;
        values.language = language;
        AppDispatcher.dispatch(UiActionCreators.updateSettingValues(values));
    }

    onClickFontSettingItem() {
        const uiState = UiStore.getState();
        const focusedListItemIndex = uiState.settingValues.font;
        let callbacks: {
            [name: string]: () => void;
        } = {};

        Object.entries(Font).forEach(([_index, eachFont]) => {
            const assertedFont = eachFont as Font;

            if (typeof assertedFont === 'number') {
                callbacks[fontNameToString(assertedFont)] = () => {
                    Settings.updateFontSettingTo(assertedFont);
                }
            }
        });

        AppDispatcher.dispatch(UiActionCreators.updateSettingValueList(focusedListItemIndex, callbacks));
        Settings.switchToSettingValueListPage();
    }

    onClickTosItem() {
        window.open(tosUrl, Localization.getMessage('setting.window_title.tos'));
    }

    onClickPrivacyPolicyItem() {
        window.open(privacyPolicyUrl, Localization.getMessage('setting.window_title.privacy_policy'));
    }

    onClickLicenseItem() {
        window.open(licenseUrl, Localization.getMessage('setting.window_title.license'));
    }

    onClickSignoutItem() {
        if (window.confirm(Localization.getMessage('setting.message.do_you_really_signout'))) {
            Settings.signout(() => {
                alert(Localization.getMessage('setting.message.successfully_signed_out'));
                window.location.reload();
            }, () => {
                alert(Localization.getMessage('setting.message.signout_failed'));
            });
        }
    }

    onClickSuspensionItem() {
        const user = firebaseAuth.currentUser!;
        const email = user.email!;
        const emailPatt = /\d{2}im\d{4}@i-u\.ac\.jp/;

        if (email.match(emailPatt) === null) {
            alert(Localization.getMessage('setting.message.this_google_account_is_incorrect'));
            return;
        }

        if (window.confirm(Localization.getMessage('setting.message.do_you_really_suspend_use'))) {
            const studentId = email.split('@')[0];
            const input = window.prompt(Localization.getMessage('setting.message.enter_your_student_id', studentId));

            if(input === null) {
                alert(Localization.getMessage('setting.message.suspension_of_use_has_been_canceled'));
            } else if (input === studentId) {
                // Settings.suspendAccount(user);
            } else {
                alert(Localization.getMessage('setting.message.student_id_is_incorrect'));
            }
        } else {
            alert(Localization.getMessage('setting.message.suspension_of_use_has_been_canceled'));
        }
    }

    static signout(onSuccess: () => void = () => {}, onError: () => void = () => {}) {
        firebaseAuth.signOut()
            .then(onSuccess)
            .catch(onError);
    }

    static updateFontSettingTo(font: Font) {
        const values = UiStore.getState().settingValues;
        values.font = font;
        AppDispatcher.dispatch(UiActionCreators.updateSettingValues(values));
    }

    static switchToSettingValueListPage() {
        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(pageList['SettingValueList']));
    }

    onUpdateUiState() {
        if (!this._isMounted) {
            return;
        }

        const uiState = UiStore.getState();

        if (uiState.latestKind === ActionKind.UpdateSettingValues) {
            saveSettingValuesToCookie(uiState.settingValues);
        }
    }
}

export default Settings;

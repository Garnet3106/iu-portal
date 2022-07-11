import { Component } from 'react';
import { BodyProps } from '../Body';
import SettingItem from './SettingItem/SettingItem';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import { pageList } from '../../../page';
import Localization from '../../../localization';
import { searchCookieValue, switchAccountKey } from '../../App';
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

function getSettingValueOnCookie(key: SettingValueKey): number | null {
    const value = Number(searchCookieValue(`settings_${key}`));
    return !isNaN(value) ? value : null;
}

function loadSettingValuesFromCookie(): SettingValues {
    const language = getSettingValueOnCookie(SettingValueKey.Language) as Language;
    const font = getSettingValueOnCookie(SettingValueKey.Font) as Font;

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
                            <SettingItem itemName="" itemValue={Localization.getMessage('setting.item.switch_account')} onClickItem={this.onClickSwitchAccountItem}/>
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

    onClickSwitchAccountItem() {
        if (window.confirm(Localization.getMessage('setting.message.do_you_really_switch_account'))) {
            document.cookie = `${switchAccountKey}=true; path=/`;
            AppDispatcher.dispatch(UiActionCreators.signout());
            window.location.reload();
        }
    }

    onClickSuspensionItem() {
        alert(Localization.getMessage('setting.message.please_contact_us_when_you_want_to_suspend_account'));
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

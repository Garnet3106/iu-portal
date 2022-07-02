import { Component } from 'react';
import { BodyProps } from '../Body';
import SettingItem from './SettingItem/SettingItem';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import { pageList } from '../../../page';
import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../../../firebase/firebase';
import { JsonApi, JsonApiRequestActionKind } from '../../../jsonapi';
import './Settings.css';

const tosUrl = '/privacypolicy';
const privacyPolicyUrl = '/tos';
const licenseUrl = '/license';

export enum Language {
    EnglishUs,
    Japanese,
    JapaneseKana,
}

export function languageNameToJapanese(lang: Language): string {
    switch (lang) {
        case Language.EnglishUs:
        return '英語 (アメリカ)';

        case Language.Japanese:
        return '日本語';

        case Language.JapaneseKana:
        return '日本語 (かな)';
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

export enum SettingKind {
    Language,
    Font,
}

class Settings extends Component<BodyProps> {
    private _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;
        UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        const uiState = UiStore.getState();

        return (
            <div className="Settings body-component" id={this.props.page.name} style={this.props.style}>
                <div className="settings-group">
                    <div className="settings-group-title">
                        表示
                    </div>
                    <div className="settings-group-items">
                        <SettingItem itemName="言語" itemValue={languageNameToJapanese(uiState.settingValues.language)} onClickItem={this.onClickLanguageSettingItem}/>
                        <SettingItem itemName="フォント" itemValue={fontNameToString(uiState.settingValues.font)} onClickItem={this.onClickFontSettingItem}/>
                    </div>
                </div>
                <div className="settings-group">
                    <div className="settings-group-title">
                        規約等
                    </div>
                    <div className="settings-group-items">
                        <SettingItem itemName="" itemValue="利用規約" onClickItem={this.onClickTosItem}/>
                        <SettingItem itemName="" itemValue="プライバシーポリシー" onClickItem={this.onClickPrivacyPolicyItem}/>
                        <SettingItem itemName="" itemValue="ライセンス表示" onClickItem={this.onClickLicenseItem}/>
                    </div>
                </div>
                <div className="settings-group">
                    <div className="settings-group-title">
                        アカウント
                    </div>
                    <div className="settings-group-items">
                        <SettingItem itemName="" itemValue="サインアウト" onClickItem={this.onClickSignoutItem}/>
                        <SettingItem itemName="" itemValue="利用停止" onClickItem={this.onClickSuspensionItem} isRedColor={true}/>
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
                callbacks[languageNameToJapanese(assertedLang)] = () => {
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
        window.open(tosUrl, 'iU Portal 利用規約');
    }

    onClickPrivacyPolicyItem() {
        window.open(privacyPolicyUrl, 'iU Portal プライバシーポリシー');
    }

    onClickLicenseItem() {
        window.open(licenseUrl, 'iU Portal ライセンス表示');
    }

    onClickSignoutItem() {
        if (window.confirm('サインアウトします。よろしいですか？')) {
            Settings.signout(() => {
                alert('サインアウトしました。');
                window.location.reload();
            });
        }
    }

    onClickSuspensionItem() {
        alert('unimplemented');
    }

    static signout(onSuccess: () => void = () => {}) {
        signOut(firebaseAuth)
            .then(() => {
                const req = {
                    actionKind: JsonApiRequestActionKind.Signout,
                    parameters: {},
                    onSucceed: onSuccess,
                    onBadRequest: () => {},
                    onFailToAuth: () => {},
                    onError: () => {},
                };

                JsonApi.request(req);
            });
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
            this.forceUpdate();
        }
    }
}

export default Settings;

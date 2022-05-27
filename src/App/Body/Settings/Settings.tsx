import { Component } from 'react';
import SettingItem from './SettingItem/SettingItem';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore, { Page } from '../../../flux/UiStore';
import { BodyProps } from '../Body';
import './Settings.css';

export enum Language {
    EnglishUs = 'en_us',
    Japanese = 'ja',
    JapaneseKana = 'ja_kana',
}

export enum Font {
    HpSimplified = 'HP Simplified',
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
            <div className="Settings body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="settings-group">
                    <div className="settings-group-title">
                        表示
                    </div>
                    <div className="settings-group-items">
                        <SettingItem itemName="言語" itemValue={uiState.settingValues.language} onClickItem={this.onClickLanguageSettingItem}/>
                        <SettingItem itemName="フォント" itemValue={uiState.settingValues.font} onClickItem={this.onClickFontSettingItem}/>
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
        AppDispatcher.dispatch(UiActionCreators.updateSettingValueList({
            '日本語': () => {
                Settings.updateLanguageSettingTo(Language.Japanese);
            },
            '日本語 (かな)': () => {
                Settings.updateLanguageSettingTo(Language.JapaneseKana);
            },
            '英語': () => {
                Settings.updateLanguageSettingTo(Language.EnglishUs);
            },
        }));

        Settings.switchToSettingValueListPage();
    }

    static updateLanguageSettingTo(language: Language) {
        const values = UiStore.getState().settingValues;
        values.language = language;
        AppDispatcher.dispatch(UiActionCreators.updateSettingValues(values));
    }

    onClickFontSettingItem() {
        AppDispatcher.dispatch(UiActionCreators.updateSettingValueList({
            'HP Simplified': () => {
                Settings.updateFontSettingTo(Font.HpSimplified);
            },
        }));

        Settings.switchToSettingValueListPage();
    }

    static updateFontSettingTo(font: Font) {
        const values = UiStore.getState().settingValues;
        values.font = font;
        AppDispatcher.dispatch(UiActionCreators.updateSettingValues(values));
    }

    static switchToSettingValueListPage() {
        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(new Page(6, 'SettingValueList')));
    }

    onUpdateUiState() {
        if (!this._isMounted) {
            return;
        }

        const uiState = UiStore.getState();

        if (uiState.hasSettingValuesUpdated) {
            this.forceUpdate();
        }
    }
}

export default Settings;

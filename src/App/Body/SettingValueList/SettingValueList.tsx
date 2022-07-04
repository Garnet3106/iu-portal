import { Component } from 'react';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore from '../../../flux/UiStore';
import Localization from '../../../localization';
import { pageList } from '../../../page';
import { BodyProps } from '../Body';
import SettingItem from '../Settings/SettingItem/SettingItem';
import './SettingValueList.css';

export type SettingValueListState = {
    focusedListItemIndex: number | null,
    listItemCallbacks: {
        [name: string]: () => void,
    },
}

class SettingValueList extends Component<BodyProps, SettingValueListState> {
    private _isMounted: boolean;
    private _focusedListItemIndex: number | null;
    private _listItemCallbacks: {
        [name: string]: () => void,
    } | null;

    constructor(props: BodyProps) {
        super(props);

        this.state = {
            focusedListItemIndex: null,
            listItemCallbacks: {},
        };

        this._isMounted = false;
        this._focusedListItemIndex = null;
        this._listItemCallbacks = null;

        UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        let valueItems: JSX.Element[] = [];

        Object.keys(this.state.listItemCallbacks).forEach((itemValue: string, index: number) => {
            let focuseItem = this.state.focusedListItemIndex !== null && index === this.state.focusedListItemIndex;

            valueItems.push((<SettingItem itemName="" itemValue={itemValue} focuseItem={focuseItem} onClickItem={() => {
                this.onClickItem(itemValue);
            }} key={`settingValueListItem_${index}`} />));
        });

        return (
            <div className="SettingValueList body-component" id={this.props.page.name} style={this.props.style}>
                <div className="settings-group">
                    <div className="settings-group-title">
                        {Localization.getMessage('setting.message.select_an_item')}
                    </div>
                    {valueItems}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._focusedListItemIndex !== null && this._listItemCallbacks !== null) {
            this.setState({
                focusedListItemIndex: this._focusedListItemIndex,
                listItemCallbacks: this._listItemCallbacks,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onClickItem(itemValue: string) {
        const uiState = UiStore.getState();
        const onClick = uiState.settingValueListItems[itemValue];

        if (onClick !== undefined) {
            onClick();
        }

        SettingValueList.switchToSettingPage();
    }

    static switchToSettingPage() {
        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(pageList['Settings']));
    }

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (this._isMounted) {
            this.setState({
                focusedListItemIndex: uiState.focusedListItemIndex,
                listItemCallbacks: uiState.settingValueListItems,
            });
        } else {
            this._focusedListItemIndex = uiState.focusedListItemIndex;
            this._listItemCallbacks = uiState.settingValueListItems;
        }
    }
}

export default SettingValueList;

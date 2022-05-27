import { Component } from 'react';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import UiStore, { Page } from '../../../flux/UiStore';
import { BodyProps } from '../Body';
import SettingItem from '../Settings/SettingItem/SettingItem';
import './SettingValueList.css';

export type SettingValueListState = {
    listItemCallbacks: {
        [name: string]: () => void,
    },
}

class SettingValueList extends Component<BodyProps, SettingValueListState> {
    private _isMounted: boolean;
    private _listItemCallbacks: {
        [name: string]: () => void,
    } | null;

    constructor(props: BodyProps) {
        super(props);

        this.state = {
            listItemCallbacks: {},
        };

        this._isMounted = false;
        this._listItemCallbacks = null;

        UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        let valueItems: JSX.Element[] = [];

        Object.keys(this.state.listItemCallbacks).forEach((itemValue: string, index: number) => {
            valueItems.push((<SettingItem itemName="" itemValue={itemValue} onClickItem={() => {
                this.onClickItem(itemValue);
            }} key={`settingValueListItem_${index}`} />))
        });

        return (
            <div className="SettingValueList body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="settings-group">
                    <div className="settings-group-title">
                        項目選択
                    </div>
                    {valueItems}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._listItemCallbacks !== null) {
            this.setState({
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
    }

    static switchToSettingPage() {
        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(new Page(5, 'Settings')));
    }

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (this._isMounted) {
            this.setState({
                listItemCallbacks: uiState.settingValueListItems,
            });
        } else {
            this._listItemCallbacks = uiState.settingValueListItems;
        }
    }
}

export default SettingValueList;

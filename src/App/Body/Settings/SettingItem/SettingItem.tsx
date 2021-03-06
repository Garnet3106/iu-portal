import { Component } from 'react';
import './SettingItem.css';

export type SettingItemProps = {
    itemName: string,
    itemValue: string,
    focuseItem?: boolean,
    onClickItem: () => void,
}

class SettingItem extends Component<SettingItemProps> {
    render() {
        return (
            <div className="settings-item" onClick={this.props.onClickItem}>
                <div className="settings-item-name">
                    {this.props.itemName}
                </div>
                <div className={this.props.focuseItem ? 'settings-item-value-focused' : 'settings-item-value'}>
                    {this.props.itemValue}
                </div>
            </div>
        );
    }
}

export default SettingItem;

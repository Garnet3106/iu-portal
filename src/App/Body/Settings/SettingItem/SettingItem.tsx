import { Component } from 'react';
import './SettingItem.css';

export type SettingItemProps = {
    itemName: string,
    itemValue: string,
    focuseItem?: boolean,
    isRedColor?: boolean,
    onClickItem: () => void,
}

class SettingItem extends Component<SettingItemProps> {
    render() {
        let className = this.props.focuseItem ? 'settings-item-value-focused' : 'settings-item-value';
        className += this.props.isRedColor === true ? ' settings-item-value-red' : '';

        return (
            <div className="settings-item" onClick={this.props.onClickItem}>
                <div className="settings-item-name">
                    {this.props.itemName}
                </div>
                <div className={className}>
                    {this.props.itemValue}
                </div>
            </div>
        );
    }
}

export default SettingItem;

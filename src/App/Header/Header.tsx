import React from 'react';
import { ActionKind } from '../../flux/AppConstants';
import UiStore from '../../flux/UiStore';
import Localization from '../../localization';
import './Header.css';

class Header extends React.Component {
    headerContent: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this.headerContent = React.createRef();

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            switch (uiState.latestKind) {
                case ActionKind.Signin: {
                    const currentHeader = this.headerContent.current;

                    if (currentHeader !== null) {
                        currentHeader.style.top = '0';
                    }
                } break;

                case ActionKind.Signout: {
                    const currentHeader = this.headerContent.current;

                    if (currentHeader !== null) {
                        currentHeader.style.top = 'calc(var(--header-height) * -1)';
                    }
                } break;
            }
        });
    }

    render() {
        return (
            <div className="Header">
                {/* todo: add service logo */}
                <div className="header-content" ref={this.headerContent}>
                    <div className="header-text">
                        {Localization.getMessage('service.name')}
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;

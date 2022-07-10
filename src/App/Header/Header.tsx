import Localization from '../../localization';
import './Header.css';

function Header() {
    return (
        <div className="Header">
            {/* todo: add service logo */}
            <div className="header-text">
                {Localization.getMessage('service.name')}
            </div>
        </div>
    );
}

export default Header;

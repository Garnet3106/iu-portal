import Header from '../Header/Header';
import './AssignmentList.css';

function AssignmentList() {
    return (
        <>
        <Header />
        <div className="AssignmentList">
            <div className="display-order">
                <div className="display-order-item">
                    期限が早い順
                </div>
                <div className="display-order-item">
                    出題が早い順
                </div>
            </div>
            <hr className="division-line" />
            <div className="assignment-list">
                <div className="assignment-group">
                    <div className="assignment-group-title">
                        提出期限切れ
                    </div>
                    <div className="assignment-group-content">
                        <div className="assignment-item">
                            <div>
                                <div className="assignment-item-operation" />
                                <div className="assignment-item-content">
                                    <div className="assignment-item-subject">
                                        マーケティング基礎
                                    </div>
                                    <div className="assignment-item-deadline">
                                        今週日曜日 23:59 まで
                                    </div>
                                </div>
                            </div>
                            <div className="assignment-item-button-list">
                                <div className="assignment-item-button-item" />
                                <div className="assignment-item-button-item" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default AssignmentList;

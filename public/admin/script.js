const apiUrl = 'http://localhost:8000/';
let hasInfoLoaded = false;

window.addEventListener('load', () => {
    const reqElement = document.getElementById('request');
    const reqButtonElement = document.getElementById('mainMenu_requestButton');
    const infoElement = document.getElementById('info');
    const infoButtonElement = document.getElementById('mainMenu_infoButton');

    reqButtonElement.addEventListener('click', () => {
        reqElement.style.display = 'flex';
        infoElement.style.display = 'none';
    });

    infoButtonElement.addEventListener('click', () => {
        if (!hasInfoLoaded) {
            hasInfoLoaded = true;

            const assignmentAcquirementUrl = apiUrl + 'get_assignments';

            request(assignmentAcquirementUrl, (event) => {
                renderInfoGroups(JSON.parse(event.target.responseText));
            }, () => {
                alert('課題情報の取得に失敗しました');
            });
        }

        reqElement.style.display = 'none';
        infoElement.style.display = 'flex';
    });

    const reqSendButton = document.getElementById('requestSendButton');
    reqSendButton.addEventListener('click', onClickRequestSendButton);
});

function onClickRequestSendButton() {
    const kindElement = document.getElementById('requestKind');
    const bodyElement = document.getElementById('requestBody');
    const url = `${apiUrl}${kindElement.value}?req=${encodeURIComponent(bodyElement.value)}`;

    if (kindElement.value === '') {
        alert('種類を入力してください');
        return;
    }

    if (!window.confirm('本当に送信しますか？')) {
        return;
    }

    request(url, (event) => {
        alert('送信しました');
        bodyElement.value = event.target.response + '\n\n' + bodyElement.value;
    }, () => {
        alert('送信に失敗しました');
    });
}

function renderInfoGroups(response) {
    if (response.status !== 200) {
        alert('課題情報の取得に失敗しました');
        return;
    }

    const groupElements = [];

    Object.entries(response.contents).forEach((pair) => {
        const [title, values] = pair;
        const titleElement = `<div class="info-group-title">${title}</div>`;
        const valueElementMap = [];

        Object.entries(values).forEach((pair) => {
            const [_uuid, valuePairs] = pair;

            Object.entries(valuePairs).forEach((eachValuePair) => {
                const [eachName, eachValue] = eachValuePair;
                const newValueElement = `<div class="info-group-list-item-value">${eachValue}</div>`;

                if (!(eachName in valueElementMap)) {
                    valueElementMap[eachName] = [];
                }

                valueElementMap[eachName].push(newValueElement);
            });
        });

        const listItemElements = Object.entries(valueElementMap).map((valueElements, _eachName) => {
            return `
                <div class="info-group-list-item">
                    <div class="info-group-list-item-value">${valueElements[0]}</div>
                    ${valueElements[1].join('')}
                </div>
            `;
        });

        const listElement = `<div class="info-group-list">${listItemElements.join('')}</div>`;
        const newGroupElement = `<div class="info-group">${titleElement}${listElement}</div>`;
        groupElements.push(newGroupElement);
    });

    const infoElement = document.getElementById('info');
    infoElement.innerHTML = groupElements.join('');
}

function request(url, onLoad, onError) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onLoad);
    xhr.addEventListener('error', onError);
    xhr.open('GET', url);
    xhr.withCredentials = true;
    xhr.send();
}

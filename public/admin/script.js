const apiUrl = 'http://localhost:8000/';

window.addEventListener('load', () => {
    const reqSendButton = document.getElementById('requestSendButton');
    reqSendButton.addEventListener('click', onClickRequestSendButton);
});

function onClickRequestSendButton() {
    const kind = document.getElementById('requestKind').value;
    const body = document.getElementById('requestBody').value;
    const url = `${apiUrl}${kind}?req=${encodeURIComponent(body)}`;

    if (!window.confirm('本当に送信しますか？')) {
        return;
    }

    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', (event) => {
        console.log();
        alert(`送信しました\n\n${event.target.response}`);
    });

    xhr.addEventListener('error', () => {
        alert('送信にエラーしました。');
    });

    xhr.open('GET', url);
    xhr.withCredentials = true;
    xhr.send();
}

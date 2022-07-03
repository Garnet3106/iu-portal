import UiStore from "./flux/UiStore";

export type LocalizationMessage = {
    enUs: string | ((args?: object[]) => string),
    ja: string | ((args?: object[]) => string),
    jaKana: string | ((args?: object[]) => string),
}

export type LocalizationMessageList = {
    [index: string]: LocalizationMessage | LocalizationMessageList,
};

const messageList: LocalizationMessageList = {
    'assignment_list': {
        'no_assignments_to_display': {
            enUs: 'There are no assignments to display.',
            ja: '表示する課題はありません。',
            jaKana: 'ひょうじするかだいはありません。',
        },
        'display_order': {
            'all': {
                enUs: 'All',
                ja: 'すべて',
                jaKana: 'すべて',
            },
            'completed': {
                enUs: 'Completed',
                ja: '完了済',
                jaKana: 'かんりょう',
            },
            'deadline': {
                enUs: 'Deadline',
                ja: '提出期限',
                jaKana: 'きげん',
            },
        },
        'group_title': {
            'all': {
                enUs: 'All',
                ja: 'すべて',
                jaKana: 'すべて',
            },
            'completed': {
                enUs: 'Completed',
                ja: '完了済',
                jaKana: 'かんりょうずみ',
            },
        },
    },
    'setting': {
        'group': {
            'display': {
                enUs: 'Display',
                ja: '表示',
                jaKana: 'ひょうじ',
            },
            'terms': {
                enUs: 'Terms',
                ja: '規約',
                jaKana: 'きやく',
            },
            'account': {
                enUs: 'Account',
                ja: 'アカウント',
                jaKana: 'あかうんと',
            },
        },
        'item': {
            'languages': {
                enUs: 'Languages',
                ja: '言語',
                jaKana: 'げんご',
            },
            'fonts': {
                enUs: 'Fonts',
                ja: 'フォント',
                jaKana: 'ふぉんと',
            },
            'tos': {
                enUs: 'Terms of Use',
                ja: '利用規約',
                jaKana: 'りようきやく',
            },
            'privacy_policy': {
                enUs: 'Privacy Policy',
                ja: 'プライバシーポリシー',
                jaKana: 'ぷらいばしーぽりしー',
            },
            'licenses': {
                enUs: 'Licenses',
                ja: 'ライセンス',
                jaKana: 'らいせんす',
            },
            'signout': {
                enUs: 'Signout',
                ja: 'サインアウト',
                jaKana: 'さいんあうと',
            },
            'suspension_of_use': {
                enUs: 'Suspension of Use',
                ja: '利用停止',
                jaKana: 'りようていし',
            },
        },
    },
};

class Localization {
    public static getMessage(key: string, args?: object[]): string {
        const errorMsg = `[${key}]`;
        const listIds = key.split('.');
        const msgId = listIds.pop()!;
        let enclosingList: LocalizationMessageList | null = messageList;

        listIds.some((eachListId: string) => {
            const child = enclosingList![eachListId];

            // Validate whether child exists and child is a list.
            if (child === undefined || child.enUs !== undefined) {
                enclosingList = null;
                return true;
            }

            enclosingList = child as LocalizationMessageList;
            return false;
        });

        if (enclosingList === null) {
            return errorMsg;
        }

        const msg = enclosingList[msgId];

        if (msg === undefined) {
            return errorMsg;
        }

        const uiState = UiStore.getState();
        const lang = uiState.settingValues.language;
        const msgPair = Object.entries(msg).at(lang);

        if (msgPair !== undefined && msgPair !== null) {
            switch (typeof msgPair[1]) {
                case 'string':
                return msgPair[1];

                case 'function':
                return msgPair[1](args);

                default:
                return errorMsg;
            }
        } else {
            return errorMsg;
        }
    }
}

export default Localization;

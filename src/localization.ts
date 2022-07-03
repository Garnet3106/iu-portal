import UiStore from "./flux/UiStore";

export type LocalizationMessage = {
    enUs: string | ((args?: any) => string),
    ja: string | ((args?: any) => string),
    jaKana: string | ((args?: any) => string),
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
    'assignment_preview': {
        'assignment_is_not_loaded': {
            enUs: 'Assignment is not loaded.',
            ja: '課題が読み込まれていません',
            jaKana: 'かだいがよみこまれていません。',
        },
        'registrar': {
            enUs: 'Registrar',
            ja: '登録者',
            jaKana: 'とうろくしゃ',
        },
        'checked_by_n_admins': {
            enUs: (checker_num: number) => `checked by ${checker_num} admin${checker_num !== 1 ? 's' : ''}`,
            ja: (checker_num: number) => `${checker_num} 人が照合`,
            jaKana: (checker_num: number) => `${checker_num} にんがしょうごう`,
        },
        'no_deadline': {
            enUs: 'No Deadline',
            ja: '期限なし',
            jaKana: 'きげんなし',
        },
        'assigned_from': {
            enUs: 'Assigned from',
            ja: '配布元',
            jaKana: 'はいふもと',
        },
        'submit_to': {
            enUs: 'Submit to',
            ja: '提出先',
            jaKana: 'ていしゅつさき',
        },
    },
    'notification_list': {
        'new_assignment': {
            enUs: 'New Assignment',
            ja: '新しい課題',
            jaKana: 'あたらしいかだい',
        },
        'welcome_to_notification_list': {
            enUs: 'Welcome to Notification List',
            ja: '通知リストにようこそ',
            jaKana: 'つうちりすとにようこそ',
        },
        'arrived_notifications_are_displayed_here': {
            enUs: 'Arrived notifications are displayed here.',
            ja: '届いた通知はここに表示されます。',
            jaKana: 'とどいたつうちはここにひょうじされます。',
        },
    },
    'statistics': {
        'statistics': {
            enUs: 'Statistics',
            ja: '統計',
            jaKana: 'とうけい',
        },
        'top_item': {
            'submission_on_month': {
                enUs: (separator: string) => `Subm.${separator}on Month`,
                ja: (separator: string) => `今月の${separator}提出数`,
                jaKana: (separator: string) => `てい${separator}しゅつ`,
            },
            'unsubmission_on_month': {
                enUs: (separator: string) => `Unsubm.${separator}on Month`,
                ja: (separator: string) => `今月の${separator}未提出数`,
                jaKana: (separator: string) => `みてい${separator}しゅつ`,
            },
            'submission_rate_on_month': {
                enUs: (separator: string) => `Subm. Rate${separator}on Month`,
                ja: (separator: string) => `今月の${separator}提出率`,
                jaKana: (separator: string) => `ていしゅつ${separator}りつ`,
            },
            'assignment_unit': {
                enUs: 'asgn.',
                ja: 'コ',
                jaKana: 'こ',
            },
        },
        'detailed_item': {
            'submission_rate': {
                enUs: 'Submission Rate',
                ja: '提出率',
                jaKana: 'ていしゅつりつ',
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
    public static getMessage(key: string, args?: any): string {
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

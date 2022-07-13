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
    'service': {
        'name': {
            enUs: 'iU Portal',
            ja: 'iU Portal',
            jaKana: 'iU Portal',
        },
        'catchphrase': {
            enUs: 'Easy Assignment Management',
            ja: 'タスク帳いらずの提出物管理',
            jaKana: 'タスク帳いらずの提出物管理',
        },
    },
    'signin': {
        'with': {
            'google': {
                enUs: 'Signin with Google',
                ja: 'Google でサインイン',
                jaKana: 'Google でさいんいん',
            },
            'email': {
                enUs: 'Signin with Email',
                ja: 'Eメールでサインイン',
                jaKana: 'いーめーるでさいんいん',
            },
        },
        'error': {
            'cannot_use_this_account': {
                enUs: 'You cannot use this account.\nPlease re-signin with an account that you registered.',
                ja: 'このアカウントは利用できません。\n契約開始時に登録したアカウントでサインインし直してください。',
                jaKana: 'このあかうんとはりようできません。\nけいやくかいしじにとうろくしたあかうんとで、さいんいんしなおしてください。',
            },
            'failed_to_auth_with_google_account': {
                enUs: 'Failed to auth with Google account.',
                ja: 'Google アカウントでの認証に失敗しました。',
                jaKana: 'Google あかうんとでのにんしょうにしっぱいしました。',
            },
            'not_support_signin_with_email_temporary': {
                enUs: 'We\'re not supporting signin with email temporary.',
                ja: '現在Eメールによるサインインは対応していません。',
                jaKana: 'げんざい、いーめーるによるさいんいんはたいおうしていません。',
            },
        },
    },
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
        'deadline': {
            'no_deadline': {
                enUs: 'No Deadline',
                ja: '期限なし',
                jaKana: 'きげんなし',
            },
            'until_date': {
                enUs: (date: string) => `Until ${date}`,
                ja: (date: string) => `${date} まで`,
                jaKana: (date: string) => `${date} まで`,
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
            jaKana: (checker_num: number) => `${checker_num} にんが しょうごう`,
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
        'kind': {
            'assignment_registration': {
                enUs: 'New Assignment',
                ja: '新しい課題',
                jaKana: 'あたらしいかだい',
            },
            'welcome_to_notification_list': {
                enUs: 'Welcome to Notification List',
                ja: '通知リストにようこそ',
                jaKana: 'つうちりすとにようこそ',
            },
        },
        'message': {
            'arrived_notifications_are_displayed_here': {
                enUs: 'Arrived notifications are displayed here.',
                ja: '届いた通知はここに表示されます。',
                jaKana: 'とどいたつうちはここにひょうじされます。',
            },
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
            'contact_form': {
                enUs: 'Contact Form',
                ja: 'お問い合わせフォーム',
                jaKana: 'おといあわせふぉーむ',
            },
            'switch_account': {
                enUs: 'Switch Account',
                ja: 'アカウント切り替え',
                jaKana: 'あかうんときりかえ',
            },
            'suspension_of_use': {
                enUs: 'Suspension of Use',
                ja: '利用停止',
                jaKana: 'りようていし',
            },
        },
        'window_title': {
            'tos': {
                enUs: 'iU Portal - Terms of Use',
                ja: 'iU Portal - 利用規約',
                jaKana: 'iU Portal - りようきやく',
            },
            'privacy_policy': {
                enUs: 'iU Portal - Privacy Policy',
                ja: 'iU Portal - プライバシーポリシー',
                jaKana: 'iU Portal - ぷらいばしーぽりしー',
            },
            'license': {
                enUs: 'iU Portal - License',
                ja: 'iU Portal - ライセンス',
                jaKana: 'iU Portal - らいせんす',
            },
            'contact_form': {
                enUs: 'iU Portal - Contact Form',
                ja: 'iU Portal - お問い合わせフォーム',
                jaKana: 'iU Portal - おといあわせふぉーむ',
            },
        },
        'message': {
            'select_an_item': {
                enUs: 'Please select an item.',
                ja: '項目を選択してください。',
                jaKana: 'こうもくをせんたくしてください。',
            },
            'do_you_really_switch_account': {
                enUs: 'Do you really switch account?',
                ja: 'ログインページに戻ります。よろしいですか？',
                jaKana: 'ろぐいんぺーじにもどります。よろしいですか？',
            },
            'please_contact_us_when_you_want_to_suspend_account': {
                enUs: 'Please contact us when you want to suspend account. You can send us messages on the report form in app or email `contact@iu-portal.app`.',
                ja: 'アカウントを停止したい場合は管理者にご連絡ください。アプリ内の報告フォームもしくはEメール `contact@iu-portal.app` にてメッセージを送信することができます。',
                jaKana: 'あかうんとをていししたいときは、かんりしゃにごれんらくください。あぷりないのほうこくふぉーむもしくはいーめーる `contact@iu-portal.app` にてめっせーじをそうしんすることができます。',
            },
        },
    },
    'report': {
        'kind': {
            'message_to_developer': {
                enUs: 'Message to the developer (Requests, Feelings, etc)',
                ja: '開発者へのメッセージ (要望, 感想など)',
                jaKana: 'かいはつしゃへのめっせーじ (ようぼう, かんそうなど)',
            },
            'illegal_use': {
                enUs: 'Reporting Illegal Use',
                ja: '不正利用報告',
                jaKana: 'ふせいりようほうこく',
            },
            'bug_or_vulnerability': {
                enUs: 'Reporting Bugs and Vulnerabilities',
                ja: 'バグおよび脆弱性報告',
                jaKana: 'ばぐおよびぜいじゃくせいほうこく',
            },
        },
        'description': {
            enUs: (msgLenRange: [number, number]) => `Please enter your message at least ${msgLenRange[0]}, up to ${msgLenRange[1]} characters.\nExample: XXX feature is too complicated to use, and I want you to improve the behavior of it.`,
            ja: (msgLenRange: [number, number]) => `${msgLenRange[0]} 文字以上 ${msgLenRange[1]} 文字以内でご記入ください\n(例) 〇〇の機能が使いづらいので改善してほしい`,
            jaKana: (msgLenRange: [number, number]) => `${msgLenRange[0]} もじいじょう ${msgLenRange[1]} もじいないで、ごきにゅうください\n(れい) 〇〇のきのうがつかいづらいので、かいぜんしてほしい`,
        },
        'message': {
            'leave_page': {
                enUs: 'Message you input will be discarded to leave this page. Do you continue?',
                ja: 'ページを離れるとフォームに入力した内容が破棄されます。よろしいですか？',
                jaKana: 'ぺーじをはなれると、にゅうりょくされたないようがきえてしまいます。よろしいですか？',
            },
            'sending_confirmation': {
                enUs: 'Do you really send your message?\n\nAttention: This app will collect your account data, but we won\'t publish your account data and message you sent to third parties.',
                ja: '送信してよろしいですか？\n\n※ アプリの円滑な運営を目的に送信者のアカウント情報が記録されますが、アカウント情報および入力内容が第三者に公開されることはありません。',
                jaKana: 'そうしんしてよろしいですか？\n\n※ そうしんしゃのあかうんとじょうほうがきろくされますが、あかうんとじょうほうおよびにゅうりょくないようが、だいさんしゃにこうかいされることはありません。',
            },
            'enter_your_message': {
                enUs: 'Please enter your message.',
                ja: 'メッセージを入力してください。',
                jaKana: 'めっせーじをにゅうりょくしてください。',
            },
            'enter_at_lease_n_characters': {
                enUs: (minMsgLen: number) => `Please enter at lease ${minMsgLen} characters.`,
                ja: (minMsgLen: number) => `最低 ${minMsgLen} 文字は入力してください。`,
                jaKana: (minMsgLen: number) => `さいてい ${minMsgLen} もじはにゅうりょくしてください。`,
            },
            'enter_up_to_n_characters': {
                enUs: (maxMsgLen: number) => `Please enter up to ${maxMsgLen} characters.`,
                ja: (maxMsgLen: number) => `${maxMsgLen} 文字以内で入力してください。`,
                jaKana: (maxMsgLen: number) => `${maxMsgLen} もじいないでにゅうりょくしてください。`,
            },
            'thank_you_for_your_report': {
                enUs: 'Thank you for your report. We will check your message later.\n(We will reply via email if it is needed.)',
                ja: 'ご報告ありがとうございました。後ほど管理者が確認いたします。\n(必要がある場合は電子メールを通じて返信させていただきます)',
                jaKana: 'ごほうこくありがとうございました。のちほどかんりしゃがかくにんいたします。\n(ひつようがあるばあいは、でんしめーるをつうじてへんしんさせていただきあます。)',
            },
            'failed_to_send': {
                enUs: 'Failed to send your message due to technical problem. Please retry later.',
                ja: '技術的なトラブルにより送信に失敗しました。再度お試しください。',
                jaKana: 'ぎじゅつてきなとらぶるにより、そうしんにしっぱいしました。さいどおためしください。',
            },
        },
        'send': {
            enUs: 'Send',
            ja: '送信',
            jaKana: 'そうしん',
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

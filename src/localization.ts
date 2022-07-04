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
    'signin': {
        'with': {
            'google': {
                enUs: 'Signin with Google',
                ja: 'Google でサインイン',
                jaKana: 'Google でさいんいん',
            },
            'email': {
                enUs: 'Signin with E-Mail',
                ja: 'Eメールでサインイン',
                jaKana: 'いーめーるでさいんいん',
            },
        },
        'error': {
            'cannot_use_this_account': {
                enUs: 'You cannot use this account.\nPlease re-signin with your Google account which university registered.',
                ja: 'このアカウントは利用できません。\n大学が発行した Google アカウントでサインインし直してください。',
                jaKana: 'このあかうんとはりようできません。\nだいがくがはっこうした Google あかうんとで、さいんいんしなおしてください。',
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
        'kind': {
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
        },
        'message': {
            'select_an_item': {
                enUs: 'Please select an item.',
                ja: '項目を選択してください。',
                jaKana: 'こうもくをせんたくしてください。',
            },
            'do_you_really_signout': {
                enUs: 'Do you really signout?',
                ja: 'サインアウトします。よろしいですか？',
                jaKana: 'さいんあうとします。よろしいですか？',
            },
            'successfully_signed_out': {
                enUs: 'Successfully signed-out.',
                ja: '正常にサインアウトしました。',
                jaKana: 'せいじょうにさいんあうとしました。',
            },
            'this_google_account_is_incorrect': {
                enUs: 'This Google account is incorrect. Please retry with another account.',
                ja: 'この Google アカウントは異なります。他のアカウントで再度お試しください。',
                jaKana: 'この Google あかうんとはことなります。ほかのあかうんとでまたおためしください。',
            },
            'do_you_really_suspend_use': {
                enUs: 'Suspension of use will delete all information of your account. Do you continue?',
                ja: '利用停止をすると登録情報や完了状況などのすべての情報が削除されます。続行しますか？',
                jaKana: 'りようていしをすると、あかうんとのすべてのじょうほうがさくじょされます。つづけますか？',
            },
            'enter_your_student_id': {
                enUs: (studentId: string) => `Please enter your student ID '${studentId}' to continue.`,
                ja: (studentId: string) => `利用停止を続行するにはあなたの学籍番号 '${studentId}' を入力してください。`,
                jaKana: (studentId: string) => `りようていしをつづけるには、あなたのがくせきばんごう '${studentId}' をにゅうりょくしてください。`,
            },
            'suspension_of_use_has_been_canceled': {
                enUs: 'Suspension of use has been canceled.',
                ja: '利用停止をキャンセルしました。',
                jaKana: 'りようていしをきゃんせるしました。',
            },
            'student_id_is_incorrect': {
                enUs: 'Student ID is incorrect, and suspension of use has been canceled.',
                ja: '入力された学籍番号が異なるため利用停止をキャンセルしました。',
                jaKana: 'にゅうりょくされたがくせきばんごうがことなるため、りようていしをきゃんせるしました。',
            },
            'could_not_suspend_use_due_to_failure': {
                enUs: 'We could not suspend use because acquirement of account information failed.',
                ja: 'アカウント情報の取得に失敗したため利用停止できませんでした。',
                jaKana: 'あかうんとじょうほうのしゅとくにしっぱいしたため、りようていしできませんでした。',
            },
            'suspension_of_use_completed_successfully': {
                enUs: 'Suspension of use completed successfully. You can use this app again to signin later. Thank you for using iU Portal.',
                ja: '利用停止が完了しました。今後サインインすることで再度アプリをご利用いただけます。iU Portal のご利用ありがとうございました。',
                jaKana: 'りようていしがかんりょうしました。またさいんいんすることで、ふたたびあぷりをごりよういただけます。iU Portal のごりようありがとうございました。',
            },
            'could_not_suspend_use_due_to_server_error': {
                enUs: 'We could not suspend use due to server error.',
                ja: 'サーバエラーにより利用停止に失敗しました。',
                jaKana: 'さーばえらーにより、りようていしにしっぱいしました。',
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
                enUs: 'Thank you for your report. We will check your message later.',
                ja: 'ご報告ありがとうございました。後ほど管理者が確認いたします。',
                jaKana: 'ごほうこくありがとうございました。のちほどかんりしゃがかくにんいたします。',
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

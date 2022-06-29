class Page {
    index: number;
    name: string;
    isBodyComponent: boolean;

    constructor(index: number, name: string, isBodyComponent: boolean) {
        this.index = index;
        this.name = name;
        this.isBodyComponent = isBodyComponent;
    }
}

export class PageSwitch {
    from: Page;
    to: Page;

    constructor(from: Page, to: Page) {
        this.from = from;
        this.to = to;
    }

    isToRight() {
        return this.from.index < this.to.index;
    }
}

export const pageList: {
    [index: string]: Page,
} = {
    'Login': new Page(0, 'Login', true),
    'AssignmentList': new Page(1, 'AssignmentList', true),
    'AssignmentPreview': new Page(2, 'AssignmentPreview', false),
    'NotificationList': new Page(3, 'NotificationList', true),
    'Statistics': new Page(4, 'Statistics', true),
    'Settings': new Page(5, 'Settings', true),
    'SettingValueList': new Page(6, 'SettingValueList', false),
    'Report': new Page(7, 'Report', true),
};

export const defaultPage = pageList['Login'];
export const topPage = pageList['AssignmentList'];

export default Page;

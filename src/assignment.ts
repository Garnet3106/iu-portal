export function formatDate(date: Date | null, fmt: string, ifDateNull?: string): string {
    if (date === null) {
        return ifDateNull !== undefined ? ifDateNull : '';
    }

    fmt = fmt.replace(/yyyy/g, date.getFullYear().toString())
        .replace(/M/g, (date.getMonth() + 1).toString())
        .replace(/d/g, date.getDate().toString())
        .replace(/H/g, date.getHours().toString())
        .replace(/m/g, date.getMinutes().toString())
        .replace(/s/g, date.getSeconds().toString())
        .replace(/S/g, date.getMilliseconds().toString())

    return fmt;
};

export type Assignment = {
    id: string,
    registrar: User,
    numberOfCheckers: number,
    course: Course,
    lecture: Lecture,
    assignedFrom: Platform,
    assignedFromLink: string | null,
    submitTo: Platform,
    submitToLink: string | null,
    deadline: Date | null,
    description: string,
    note: string,
    completed: boolean,
};

export enum CourseElectionKind {
    Required = 'require',
    ElectivelyRequired = 'electively_required',
    Elective = 'elective',
}

export enum CourseSemester {
    First = 'first',
    Second = 'second',
}

export type Course = {
    id: string,
    name: string,
    electionKind: CourseElectionKind,
    numberOfCredit: number,
    academicYear: number,
    grade: number,
    semester: CourseSemester,
    teachers: Teacher[],
};

export type Lecture = {
    id: string,
    numberOfTimes: number,
    date: Date,
};

export type Teacher = {
    id: string,
    name: string,
};

export enum PlatformKind {
    Classroom = 'classroom',
    EMail = 'email',
    Unipa = 'unipa',
};

export type Platform = {
    id: string,
    kind: PlatformKind,
};

export type User = {
    id: string,
    nickname: string,
};

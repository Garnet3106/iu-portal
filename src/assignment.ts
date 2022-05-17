export type Assignment = {
    id: string;
    registrar: AdminUser;
    numberOfChecker: number;
    course: Course;
    lecture: Lecture;
    assignedFrom: Platform;
    submitTo: Platform;
    deadline: number;
    description: string;
    note: string;
};

export type AdminUser = {
    id: string,
    name: string,
};

export type Lecture = {
    id: string,
    name: string,
};

export enum CourseElectionKind {
    Required = 'REQUIRED',
    ElectivelyRequired = 'ELECTIVELY_REQUIRED',
    Elective = 'ELECTIVE',
}

export enum CourseSemester {
    First = 'FIRST',
    Second = 'SECOND',
}

export type Course = {
    id: string,
    name: string,
    electionKind: CourseElectionKind,
    numberOfCredit: number,
    year: number,
    grade: number,
    semester: CourseSemester,
    teachers: Teacher[],
};

export type Teacher = {
    id: string,
    name: string,
};

export enum PlatformKind {
    Classroom = 'CLASSROOM',
    EMail = 'EMAIL',
    Unipa = 'UNIPA',
};

export type Platform = {
    id: string,
    kind: PlatformKind,
};

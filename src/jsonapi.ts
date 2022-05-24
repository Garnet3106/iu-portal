import { Assignment, Course, CourseElectionKind, CourseSemester, Lecture, Platform, PlatformKind, Teacher, User } from "./assignment"

export const subdataNames = ['assignments', 'courses', 'lectures', 'teachers', 'platforms', 'users'];

// todo: change to type alias
export class UuidAssoc<Value> {
    private assoc: {
        [uuid: string]: Value,
    };

    constructor(assoc: {
        [uuid: string]: Value
    }) {
        this.assoc = assoc;
    }

    getAssoc(): {
        [uuid: string]: Value,
    } {
        return this.assoc;
    }

    at(uuid: string): Value {
        const result = this.assoc[uuid];

        if (result === undefined) {
            console.error('UUID Association Error: UUID doesn\'t exist.');
        }

        return result;
    }

    forEach(callback: (value: Value, uuid: string) => void) {
        Object.keys(this.assoc).forEach((uuid: string) => {
            callback(this.at(uuid)!, uuid);
        });
    }

    map<MapTo>(callback: (uuid: string) => MapTo): MapTo[] {
        return Object.keys(this.assoc).map((uuid: string) => uuid).map(callback);
    }

    insertIfNotExists(uuid: string, value: Value) {
        if (this.assoc[uuid] !== undefined) {
            return;
        }

        this.assoc[uuid] = value;
    }
};

export type ApiResponse<ApiResponseContent> = {
    status: string,
    message?: string,
    request: string,
    contents: ApiResponseContent,
};

export type AssignmentStructureApiResponse = ApiResponse<{
    assignments: {
        [uuid: string]: ApiResponseAssignment,
    },
    lectures: {
        [uuid: string]: ApiResponseLecture,
    },
    courses: {
        [uuid: string]: ApiResponseCourse,
    },
    teachers: {
        [uuid: string]: ApiResponseTeacher,
    },
    platforms: {
        [uuid: string]: ApiResponsePlatform,
    },
    users: {
        [uuid: string]: ApiResponseUser,
    },
}>;

export type AssociativeAssignmentStructureApiResponse = ApiResponse<{
    assignments: UuidAssoc<ApiResponseAssignment>,
    courses: UuidAssoc<ApiResponseCourse>,
    lectures: UuidAssoc<ApiResponseLecture>,
    teachers: UuidAssoc<ApiResponseTeacher>,
    platforms: UuidAssoc<ApiResponsePlatform>,
    users: UuidAssoc<ApiResponseUser>,
}>;

export function toAssignmentStructureApiResponse(response: AssignmentStructureApiResponse): AssociativeAssignmentStructureApiResponse {
    let result = {
        status: response.status,
        message: response.message,
        request: response.request,
        contents: {
            assignments: new UuidAssoc<ApiResponseAssignment>({}),
            courses: new UuidAssoc<ApiResponseCourse>({}),
            lectures: new UuidAssoc<ApiResponseLecture>({}),
            teachers: new UuidAssoc<ApiResponseTeacher>({}),
            platforms: new UuidAssoc<ApiResponsePlatform>({}),
            users: new UuidAssoc<ApiResponseUser>({}),
        },
    };

    let contents = response.contents;

    if (contents === undefined) {
        console.error('Assignment Loading Error: Property `contents` doesn\'t exist.');
        return result;
    }
    
    subdataNames.forEach((eachName: string) => {
        if ((response.contents as any)[eachName] === undefined) {
            console.error(`Assignment Loading Error: Property \`${eachName}\` doesn\'t exist.`);
            return result;
        }
    });

    result.contents = {
        assignments: new UuidAssoc(response.contents.assignments),
        courses: new UuidAssoc(response.contents.courses),
        lectures: new UuidAssoc(response.contents.lectures),
        teachers: new UuidAssoc(response.contents.teachers),
        platforms: new UuidAssoc(response.contents.platforms),
        users: new UuidAssoc(response.contents.users),
    };

    return result;
}

export type ApiResponseAssignment = {
    registrarId: string,
    numberOfCheckers: number,
    courseId: string,
    lectureId: string,
    assignedFrom: string,
    assignedFromLink: string | null,
    submitTo: string,
    submitToLink: string | null,
    deadline: string | null,
    description: string,
    note: string,
    completed: boolean,
}

export type ApiResponseCourse = {
    code: string,
    name: string,
    electionKind: string,
    numberOfCredits: number,
    academicYear: number,
    grade: number,
    semester: string,
    teacherIds: string[],
}

export type ApiResponseLecture = {
    numberOfTimes: number,
    date: string,
}

export type ApiResponseTeacher = {
    name: string,
}

export type ApiResponsePlatform = {
    numberOfTimes: number,
    nickname: string,
}

export type ApiResponseUser = {
    nickname: string,
}

export function apiResponseToAssignments(response: AssociativeAssignmentStructureApiResponse): Assignment[] {
    let contents = response.contents;

    if (contents === undefined) {
        console.error('Assignment Loading Error: Property `contents` doesn\'t exist.');
        return [];
    }

    let assignments: Assignment[] = [];

    let courses = new UuidAssoc<Course>({});
    let lectures = new UuidAssoc<Lecture>({});
    let teachers = new UuidAssoc<Teacher>({});
    let platforms = new UuidAssoc<Platform>({});
    let users = new UuidAssoc<User>({});

    contents.assignments.forEach((eachAssignment: ApiResponseAssignment, eachAssignmentId: string) => {
        // Add converted subdata in each assignment which doesn't exist before assignment addition.

        const convertedCourse = apiResponseToCourse(eachAssignment.courseId, contents.courses, teachers);
        courses.insertIfNotExists(convertedCourse.id, convertedCourse);

        const convertedLecture = apiResponseToLecture(eachAssignment.lectureId, contents.lectures);
        lectures.insertIfNotExists(convertedLecture.id, convertedLecture);

        const convertedAssignmentPlatform = apiResponseToPlatform(eachAssignment.assignedFrom, contents.platforms);
        platforms.insertIfNotExists(convertedAssignmentPlatform.id, convertedAssignmentPlatform);

        const convertedSubmissionPlatform = apiResponseToPlatform(eachAssignment.submitTo, contents.platforms);
        platforms.insertIfNotExists(convertedSubmissionPlatform.id, convertedSubmissionPlatform);
        
        let teacherIds = contents.courses.at(eachAssignment.courseId)?.teacherIds;
        
        teacherIds?.forEach((eachTeacherId: string) => {
            const convertedTeacher = apiResponseToTeacher(eachTeacherId, contents.teachers);
            teachers.insertIfNotExists(eachTeacherId, convertedTeacher);
        });

        const convertedUser = apiResponseToUser(eachAssignment.registrarId, contents.users);
        users.insertIfNotExists(convertedUser.id, convertedUser);

        assignments.push({
            id: eachAssignmentId,
            registrar: users.at(eachAssignment.registrarId),
            numberOfCheckers: eachAssignment.numberOfCheckers,
            course: courses.at(eachAssignment.courseId),
            lecture: lectures.at(eachAssignment.lectureId),
            assignedFrom: platforms.at(eachAssignment.assignedFrom),
            assignedFromLink: eachAssignment.assignedFromLink,
            submitTo: platforms.at(eachAssignment.submitTo),
            submitToLink: eachAssignment.submitToLink,
            deadline: eachAssignment.deadline !== null ? new Date(Date.parse(eachAssignment.deadline)) : null,
            description: eachAssignment.description,
            note: eachAssignment.note,
            completed: eachAssignment.completed,
        });
    });

    return assignments;
}

function apiResponseToCourse(courseId: string, courses: UuidAssoc<ApiResponseCourse>, teachers: UuidAssoc<ApiResponseTeacher>): Course {
    let targetCourse = courses.at(courseId);

    return {
        id: courseId,
        name: targetCourse.name,
        electionKind: targetCourse.electionKind as CourseElectionKind,
        numberOfCredit: targetCourse.numberOfCredits,
        academicYear: targetCourse.academicYear,
        grade: targetCourse.grade,
        semester: targetCourse.semester as CourseSemester,
        teachers: teachers.map((eachTeacherId: string) => apiResponseToTeacher(eachTeacherId, teachers)),
    };
}

function apiResponseToLecture(lectureId: string, lectures: UuidAssoc<ApiResponseLecture>): Lecture {
    let targetLecture = lectures.at(lectureId);

    return {
        id: lectureId,
        numberOfTimes: targetLecture.numberOfTimes,
        date: new Date(Date.parse(targetLecture.date)),
    };
}

function apiResponseToPlatform(platformId: string, platforms: UuidAssoc<ApiResponsePlatform>): Platform {
    let targetPlatform = platforms.at(platformId);

    return {
        id: platformId,
        kind: targetPlatform.nickname as PlatformKind,
    };
}

function apiResponseToTeacher(teacherId: string, teachers: UuidAssoc<ApiResponseTeacher>): Teacher {
    let targetTeacher = teachers.at(teacherId);

    return {
        id: teacherId,
        name: targetTeacher.name,
    };
}

function apiResponseToUser(userId: string, users: UuidAssoc<ApiResponseUser>): User {
    let targetUser = users.at(userId);

    return {
        id: userId,
        nickname: targetUser.nickname,
    };
}

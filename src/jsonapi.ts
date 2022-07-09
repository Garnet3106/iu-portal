import config from "./config";
import { Assignment, Course, CourseElectionKind, CourseSemester, Lecture, Teacher, Admin, Notification } from "./assignment"

const apiUrl = config.dbUrl;

export enum JsonApiRequestActionKind {
    Signin = 'signin',
    Report = 'report',
}

export type JsonApiRequest = {
    actionKind: JsonApiRequestActionKind,
    parameters: object,
    onSucceed: (req: XMLHttpRequest, response: any) => void,
    onBadRequest: (req: XMLHttpRequest, response: any) => void,
    onFailToAuth: (req: XMLHttpRequest, response: any) => void,
    onError: () => void,
}

export const JsonApi = {
    request(req: JsonApiRequest) {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            let response = {
                status: 200,
            };

            try {
                response = JSON.parse(xhr.responseText);
            } catch {
                console.error('Assignment Loading Error: Failed to parse JSON code.');
            }

            switch (response.status) {
                case 200:
                req.onSucceed(xhr, response);
                break;

                case 400:
                req.onBadRequest(xhr, response);
                break;

                case 401:
                req.onFailToAuth(xhr, response);
                break;
            }
        });

        xhr.addEventListener('error', req.onError);
        const jsonReqStr = encodeURIComponent(JSON.stringify(req.parameters));
        xhr.open('GET', `${apiUrl}/${req.actionKind}?req=${jsonReqStr}`);
        xhr.withCredentials = true;
        xhr.send();
    },
};

export const subdataNames = ['assignments', 'courses', 'lectures', 'teachers', 'admins'];

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
            console.error(`UUID Association Error: UUID \`${uuid}\` doesn't exist.`);
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
    admins: {
        [uuid: string]: ApiResponseAdmin,
    },
    notifications: {
        [uuid: string]: ApiResponseNotification,
    },
}>;

export type AssociativeAssignmentStructureApiResponse = ApiResponse<{
    assignments: UuidAssoc<ApiResponseAssignment>,
    courses: UuidAssoc<ApiResponseCourse>,
    lectures: UuidAssoc<ApiResponseLecture>,
    teachers: UuidAssoc<ApiResponseTeacher>,
    admins: UuidAssoc<ApiResponseAdmin>,
    notifications: UuidAssoc<ApiResponseNotification>,
}>;

export function toAssignmentStructureApiResponse(response: AssignmentStructureApiResponse): AssociativeAssignmentStructureApiResponse {
    const result = {
        status: response.status,
        message: response.message,
        request: response.request,
        contents: {
            assignments: new UuidAssoc<ApiResponseAssignment>({}),
            courses: new UuidAssoc<ApiResponseCourse>({}),
            lectures: new UuidAssoc<ApiResponseLecture>({}),
            teachers: new UuidAssoc<ApiResponseTeacher>({}),
            admins: new UuidAssoc<ApiResponseAdmin>({}),
            notifications: new UuidAssoc<ApiResponseNotification>({}),
        },
    };

    const contents = response.contents;

    if (contents === undefined) {
        console.error('Assignment Loading Error: Property `contents` doesn\'t exist.');
        return result;
    }

    subdataNames.forEach((eachName: string) => {
        if ((contents as any)[eachName] === undefined) {
            console.error(`Assignment Loading Error: Property \`${eachName}\` doesn't exist.`);
            return result;
        }
    });

    result.contents = {
        assignments: new UuidAssoc(contents.assignments),
        courses: new UuidAssoc(contents.courses),
        lectures: new UuidAssoc(contents.lectures),
        teachers: new UuidAssoc(contents.teachers),
        admins: new UuidAssoc(contents.admins),
        notifications: new UuidAssoc(contents.notifications),
    };

    return result;
}

export type ApiResponseAssignment = {
    registrarId: string,
    numberOfCheckers: number,
    lectureId: string,
    assignmentPlatform: string | null,
    assignmentLink: string | null,
    submissionPlatform: string | null,
    submissionLink: string | null,
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
    courseId: string,
    numberOfTimes: number,
    date: string,
}

export type ApiResponseTeacher = {
    name: string,
}

export type ApiResponseAdmin = {
    nickname: string,
}

export type ApiResponseNotification = {
    kind: string,
    date: string,
    description: string,
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
    let admins = new UuidAssoc<Admin>({});

    contents.assignments.forEach((eachAssignment: ApiResponseAssignment, eachAssignmentId: string) => {
        // Add converted subdata in each assignment which doesn't exist before assignment addition.
        const courseId = contents.lectures.at(eachAssignment.lectureId).courseId;

        let teacherIds = contents.courses.at(courseId)?.teacherIds;

        teacherIds?.forEach((eachTeacherId: string) => {
            const convertedTeacher = apiResponseToTeacher(eachTeacherId, contents.teachers);
            teachers.insertIfNotExists(eachTeacherId, convertedTeacher);
        });

        const convertedLecture = apiResponseToLecture(eachAssignment.lectureId, contents.lectures);
        lectures.insertIfNotExists(convertedLecture.id, convertedLecture);

        const convertedCourse = apiResponseToCourse(courseId, contents.courses, teachers);
        courses.insertIfNotExists(convertedCourse.id, convertedCourse);

        const convertedAdmin = apiResponseToAdmin(eachAssignment.registrarId, contents.admins);
        admins.insertIfNotExists(convertedAdmin.firebaseUid, convertedAdmin);

        assignments.push({
            id: eachAssignmentId,
            registrar: admins.at(eachAssignment.registrarId),
            numberOfCheckers: eachAssignment.numberOfCheckers,
            course: courses.at(courseId),
            lecture: lectures.at(eachAssignment.lectureId),
            assignmentPlatform: eachAssignment.assignmentPlatform,
            assignmentLink: eachAssignment.assignmentLink,
            submissionPlatform: eachAssignment.submissionPlatform,
            submissionLink: eachAssignment.submissionLink,
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

function apiResponseToTeacher(teacherId: string, teachers: UuidAssoc<ApiResponseTeacher>): Teacher {
    let targetTeacher = teachers.at(teacherId);

    return {
        id: teacherId,
        name: targetTeacher.name,
    };
}

function apiResponseToAdmin(firebaseUid: string, admins: UuidAssoc<ApiResponseAdmin>): Admin {
    let targetAdmin = admins.at(firebaseUid);

    return {
        firebaseUid: firebaseUid,
        nickname: targetAdmin.nickname,
    };
}

export function apiResponseToNotifications(response: AssociativeAssignmentStructureApiResponse): Notification[] {
    const notifications = response.contents.notifications;

    return notifications.map((eachNotificationId: string) => {
        // const eachNotification = notifications.at(uuid);
        const eachNotification = notifications.at(eachNotificationId);

        return {
            id: eachNotificationId,
            kind: eachNotification.kind,
            date: eachNotification.date !== null ? new Date(eachNotification.date) : null,
            description: eachNotification.description,
        };
    });
}

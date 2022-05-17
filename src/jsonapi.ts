import { Assignment } from "./assignment"

export type JsonResponce<JsonContent> = {
    status: string,
    message: string,
    content: JsonContent,
};

export type JsonAssignmentResponce = JsonResponce<{
    assignments: Assignment[],
}>;

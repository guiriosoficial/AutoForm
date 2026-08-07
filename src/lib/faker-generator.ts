import {faker} from "@faker-js/faker";

export function generateFakerValue(type: string, configStr?: Record<string, unknown>): string {

    const path = type.split(".");
    return faker[path[0]][path[1]](configStr);
}
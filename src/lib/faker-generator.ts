import {faker} from "@faker-js/faker";

export function generateFakerValue(type: string, configStr?: string): string {
    let opts: Record<string, any> = {};
    if (configStr) {
        try { opts = JSON.parse(configStr); } catch { /* ignore invalid json */ }
    }

    const path = type.split(".");
    return faker[path[0]][path[1]](opts);
}
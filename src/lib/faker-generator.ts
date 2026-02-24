import { faker } from "@faker-js/faker";

function generateCPF(): string {
    const rand = () => Math.floor(Math.random() * 9);
    const n = Array.from({ length: 9 }, rand);
    const d1 = (n.reduce((sum, v, i) => sum + v * (10 - i), 0) * 10) % 11 % 10;
    n.push(d1);
    const d2 = (n.reduce((sum, v, i) => sum + v * (11 - i), 0) * 10) % 11 % 10;
    n.push(d2);
    return `${n.slice(0,3).join("")}.${n.slice(3,6).join("")}.${n.slice(6,9).join("")}-${n.slice(9).join("")}`;
}

function generateCNPJ(): string {
    const rand = () => Math.floor(Math.random() * 9);
    const n = Array.from({ length: 8 }, rand).concat([0, 0, 0, 1]);
    const calc = (nums: number[], weights: number[]) =>
        (nums.reduce((sum, v, i) => sum + v * weights[i], 0) % 11) < 2
            ? 0
            : 11 - (nums.reduce((sum, v, i) => sum + v * weights[i], 0) % 11);
    const d1 = calc(n, [5,4,3,2,9,8,7,6,5,4,3,2]);
    n.push(d1);
    const d2 = calc(n, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
    n.push(d2);
    return `${n.slice(0,2).join("")}.${n.slice(2,5).join("")}.${n.slice(5,8).join("")}/${n.slice(8,12).join("")}-${n.slice(12).join("")}`;
}

function generateRG(): string {
    const nums = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    return `${nums.slice(0,2).join("")}.${nums.slice(2,5).join("")}.${nums.slice(5,8).join("")}-${Math.floor(Math.random() * 10)}`;
}

export function generateFakerValue(type: string, configStr?: string): string {
    let opts: Record<string, any> = {};
    if (configStr) {
        try { opts = JSON.parse(configStr); } catch { /* ignore invalid json */ }
    }

    try {
        switch (type) {
            case "custom.cpf": return generateCPF();
            case "custom.cnpj": return generateCNPJ();
            case "custom.rg": return generateRG();
            case "custom.phoneBR":
                return `(${faker.number.int({ min: 11, max: 99 })}) 9${faker.string.numeric(4)}-${faker.string.numeric(4)}`;
            case "custom.randomNumber":
                return String(faker.number.int({ min: 1, max: 1000, ...opts }));
            case "custom.randomNumber100":
                return String(faker.number.int({ min: 1, max: 100, ...opts }));
            case "date.past":
            case "date.future":
            case "date.birthdate":
            case "date.recent": {
                const fn = type.split(".")[1] as "past" | "future" | "birthdate" | "recent";
                const d = faker.date[fn](Object.keys(opts).length ? opts : undefined);
                return d.toLocaleDateString("pt-BR");
            }
            case "number.float":
                return faker.number.float({ min: 0, max: 1000, fractionDigits: 2, ...opts }).toString();
            case "color.hex":
                return faker.color.rgb(Object.keys(opts).length ? opts : undefined);
            case "color.rgb":
                return faker.color.rgb({ format: "css", ...opts });
            default: {
                const [mod, method] = type.split(".");
                const module = (faker as any)[mod];
                if (module && typeof module[method] === "function") {
                    const result = module[method](Object.keys(opts).length ? opts : undefined);
                    return String(result);
                }
                return "N/A";
            }
        }
    } catch {
        return "Erro ao gerar";
    }
}
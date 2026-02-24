export interface FieldConfig {
    id: string;
    selector: string;
    fakerType: string;
    config?: string; // JSON string for faker options
}

export interface Preset {
    id: string;
    name: string;
    fields: FieldConfig[];
    createdAt: number;
}

export const FAKER_OPTIONS: { label: string; value: string; category: string }[] = [
    // Person
    { label: "Nome Completo", value: "person.fullName", category: "Pessoa" },
    { label: "Primeiro Nome", value: "person.firstName", category: "Pessoa" },
    { label: "Sobrenome", value: "person.lastName", category: "Pessoa" },
    { label: "Sexo", value: "person.sex", category: "Pessoa" },
    { label: "Prefixo (Sr./Sra.)", value: "person.prefix", category: "Pessoa" },
    { label: "Cargo / Profissão", value: "person.jobTitle", category: "Pessoa" },
    { label: "Bio", value: "person.bio", category: "Pessoa" },

    // Document
    { label: "CPF", value: "custom.cpf", category: "Documento" },
    { label: "CNPJ", value: "custom.cnpj", category: "Documento" },
    { label: "RG", value: "custom.rg", category: "Documento" },

    // Internet
    { label: "Email", value: "internet.email", category: "Internet" },
    { label: "Nome de Usuário", value: "internet.username", category: "Internet" },
    { label: "Senha", value: "internet.password", category: "Internet" },
    { label: "URL", value: "internet.url", category: "Internet" },
    { label: "IPv4", value: "internet.ipv4", category: "Internet" },
    { label: "User Agent", value: "internet.userAgent", category: "Internet" },

    // Phone
    { label: "Telefone", value: "phone.number", category: "Telefone" },
    { label: "Telefone (BR)", value: "custom.phoneBR", category: "Telefone" },

    // Address
    { label: "Endereço Completo", value: "location.streetAddress", category: "Endereço" },
    { label: "Rua", value: "location.street", category: "Endereço" },
    { label: "Cidade", value: "location.city", category: "Endereço" },
    { label: "Estado", value: "location.state", category: "Endereço" },
    { label: "País", value: "location.country", category: "Endereço" },
    { label: "CEP", value: "location.zipCode", category: "Endereço" },
    { label: "Latitude", value: "location.latitude", category: "Endereço" },
    { label: "Longitude", value: "location.longitude", category: "Endereço" },

    // Company
    { label: "Nome da Empresa", value: "company.name", category: "Empresa" },
    { label: "Slogan", value: "company.catchPhrase", category: "Empresa" },
    { label: "Área de Atuação", value: "company.buzzPhrase", category: "Empresa" },

    // Finance
    { label: "Número do Cartão", value: "finance.creditCardNumber", category: "Finanças" },
    { label: "CVV", value: "finance.creditCardCVV", category: "Finanças" },
    { label: "Conta Bancária (IBAN)", value: "finance.iban", category: "Finanças" },
    { label: "Valor Monetário", value: "finance.amount", category: "Finanças" },
    { label: "Moeda", value: "finance.currencyName", category: "Finanças" },
    { label: "Bitcoin Address", value: "finance.bitcoinAddress", category: "Finanças" },

    // Lorem
    { label: "Palavra", value: "lorem.word", category: "Texto" },
    { label: "Frase", value: "lorem.sentence", category: "Texto" },
    { label: "Parágrafo", value: "lorem.paragraph", category: "Texto" },
    { label: "Linhas", value: "lorem.lines", category: "Texto" },

    // Number
    { label: "Número Aleatório (1-1000)", value: "custom.randomNumber", category: "Número" },
    { label: "Número Aleatório (1-100)", value: "custom.randomNumber100", category: "Número" },
    { label: "Número Float", value: "number.float", category: "Número" },

    // Date
    { label: "Data Passada", value: "date.past", category: "Data" },
    { label: "Data Futura", value: "date.future", category: "Data" },
    { label: "Data de Nascimento", value: "date.birthdate", category: "Data" },
    { label: "Data Recente", value: "date.recent", category: "Data" },

    // Color
    { label: "Cor (Hex)", value: "color.hex", category: "Cor" },
    { label: "Cor (RGB)", value: "color.rgb", category: "Cor" },
    { label: "Nome da Cor", value: "color.human", category: "Cor" },

    // Image
    { label: "URL de Avatar", value: "image.avatar", category: "Imagem" },
    { label: "URL de Imagem", value: "image.url", category: "Imagem" },

    // Vehicle
    { label: "Placa do Veículo", value: "vehicle.vrm", category: "Veículo" },
    { label: "Modelo do Veículo", value: "vehicle.vehicle", category: "Veículo" },

    // Database
    { label: "UUID", value: "string.uuid", category: "Outros" },
    { label: "Boolean", value: "datatype.boolean", category: "Outros" },
];

export const FAKER_CATEGORIES = [...new Set(FAKER_OPTIONS.map(o => o.category))];
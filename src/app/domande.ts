interface Action {
    category: string, value: string;
}


export interface Domanda {
    index: number;
    toolName: string;
    description: string;
    dependencies: { category: string, conditions: string[] }[];
    options: { name: string, actions?: Action[] }[];
    describe: string;
}

export const domande: Domanda[] = [
    {
        index: 1,
        toolName: 'getEntityType',
        description: 'Check the entity type of the user organization',
        dependencies: [],
        options: [
            {
                name: 'Provider',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Provider")'
                }]
            },
            {
                name: 'Deployer',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Deployer")'
                }]
            },
            {
                name: 'Distributor',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Distributor")'
                }]
            },
            {
                name: 'Importer',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Importer")'
                }]
            },
            {
                name: 'Product Manufacturer',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Product Manufacturer")'
                }]
            },
            {
                name: 'Authorised Representative',
                actions: [{
                    category: 'role',
                    value: 'PUSH("Authorised Representative")'
                }]
            }

        ],
        describe: `
            the entity type the user organization is in based on these descriptions: 
              - Provider: a natural or legal person, public authority, agency or other body that develops an AI system or a general purpose AI model (or that has an AI system or a general purpose AI model developed) and places them on the market or puts the system into service under its own name or trademark, whether for payment or free of charge;
              - Deployer: any natural or legal person, public authority, agency or other body using an AI system under its authority except where the AI system is used in the course of a personal non-professional activity;
              - Distributor: any natural or legal person in the supply chain, other than the provider or the importer, that makes an AI system available on the Union market;
              - Importer: any natural or legal person located or established in the Union that places on the market an AI system that bears the name or trademark of a natural or legal person established outside the Union;
              - Authorised representative: any natural or legal person located or established in the Union who has received and accepted a written mandate from a provider of an AI system or a general purpose AI model to, respectively, perform and carry out on its behalf the obligations and procedures established by this Regulation.
              - Product manufacturer: places on the market or puts into service an AI system together with their product and under their own name or trademark;            
        `
    },
    {
        index: 2,
        toolName: 'systemModifications',
        description: `
            Possible shift of entity type to Provider if the user organization does one of those actions;
        `,
        dependencies: [
            {
                category: 'getEntityType',
                conditions: ['!Provider']
            }
        ],
        options: [
            {
                name: "Puts their name on an existing system",
                actions: [{
                    category: 'role',
                    value: 'PUSH("Provider")'
                }]
            },
            {
                name: "Makes significant changes to a system (so that it differs form the original version in a relevant way)",
                actions: [{
                    category: 'role',
                    value: 'PUSH("Provider")'
                }]
            },
            {
                name: "Modifies the intended purpose of a system",
                actions: [{
                    category: 'role',
                    value: 'PUSH("Provider")'
                }]
            },
            {
                name: "None of the above",
            }
        ],
        describe: `
            Possible shift of entity type to Provider if the user organization does one of those actions;
        `
    },
    {
        index: 3,
        toolName: 'checkTerritorialScope',
        description: 'Check if the user organization is within the territorial scope of the AI ACT',
        dependencies: [],
        options: [
            {
                name: "I am established or located within the EU",
            },
            {
                name: "My AI system's output is used in the EU",
            },
            {
                name: "My AI system is located in a non-EU country where 'EU Member State Law' applies by virtue of public international law",
            },
            {
                name: "None of the above",
                actions: [{
                    category: 'global',
                    value: 'EXIT'
                }]
            }
        ],
        describe: `
            Check if the user organization is within the territorial scope of the AI ACT
        `
    },
    {
        index: 4,
        toolName: 'checkExludedSystems',
        description: 'Check if the user organization system is excluded from the AI ACT',
        dependencies: [],
        options: [
            {
                name: 'The AI systems developed and used exclusively for military purposes',
                actions: [
                    {
                        category: 'global',
                        value: 'EXIT'
                    }
                ],
            },
            {
                name: 'AI systems used by public authorities or international organisations in third countries for law enforcement and judicial cooperation',
                actions: [
                    {
                        category: 'global',
                        value: 'EXIT'
                    }
                ],
            },
            {
                name: 'AI research and development activity',
                actions: [
                    {
                        category: 'global',
                        value: 'EXIT'
                    }
                ],
            },
            {
                name: 'AI components provided under free and open-source licences',
                actions: [
                    {
                        category: 'global',
                        value: 'EXIT'
                    }
                ],
            },
            {
                name: 'People using AI systems for purely personal, nonprofessional activity',
                actions: [
                    {
                        category: 'global',
                        value: 'EXIT'
                    }
                ],
            },
        ],
        describe: `
            Check if the user organization system is excluded from the AI ACT
        `
    },
]
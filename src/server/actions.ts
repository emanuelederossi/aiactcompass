"use server";
import { DomandaDb } from "~/app/domande";
import { db } from "./db"
import { domanda, categoria } from "./db/schema"

const category = {
    index: 1,
    nome: 'role',
    options: [
        'Provider',
        'Deployer',
        'Distributor',
        'Importer',
        'Product Manufacturer',
        'Authorised Representative',
    ]
}

const question = {
    index: 1,
    toolName: 'getEntityType',
    question: 'Determines the entity type of the user organization',
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
          - Provider: a natural or legal person, public authority, agency or other body that develops an AI system or a general purpose AI model (or that has an AI system or a general purpose AI model developed) and places them on the market or puts the system into service under its own name or trademark, whether for payment or free of charge;
          - Deployer: any natural or legal person, public authority, agency or other body using an AI system under its authority except where the AI system is used in the course of a personal non-professional activity;
          - Distributor: any natural or legal person in the supply chain, other than the provider or the importer, that makes an AI system available on the Union market;
          - Importer: any natural or legal person located or established in the Union that places on the market an AI system that bears the name or trademark of a natural or legal person established outside the Union;
          - Authorised representative: any natural or legal person located or established in the Union who has received and accepted a written mandate from a provider of an AI system or a general purpose AI model to, respectively, perform and carry out on its behalf the obligations and procedures established by this Regulation.
          - Product manufacturer: places on the market or puts into service an AI system together with their product and under their own name or trademark;            
    `
}


export async function getDomande() {
    const domande = await db.query.domanda.findMany();
    return domande;
}

interface Action {
    category: string, value: string;
}

interface DomandaDbDc {
    id?: number;
    index: number;
    toolName: string;
    question: string;
    dependencies: { category: string, value: string[] }[];
    options: { name: string, actions?: Action[] }[];
    describe: string;
}

export async function postDomanda(quest: DomandaDbDc) {
    try {        
        await db.insert(domanda).values(quest);
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }
}

export async function getCategories() {
    const categories = await db.query.categoria.findMany();
    return categories;
}

interface Categoria {
    nome: string;
    options: string[];
}

export async function postCategory(cat: Categoria) {
    try {
        await db.insert(categoria).values(cat);
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }    
}
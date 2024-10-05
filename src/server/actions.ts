"use server";
import { db } from "./db"
import { domanda, categoria, output } from "./db/schema"
import { eq, sql } from "drizzle-orm";


export async function getDomande() {
    const domande = await db.query.domanda.findMany({
        orderBy: domanda.index
    });
    return domande;
}

export async function getDomanda(id: number) {
    const domandaaa = await db.query.domanda.findMany({
        where: eq(domanda.id, id)
      })
    return domandaaa[0];
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

interface Output {
    title: string;
    content: string;
    categories: {
        id: number;
        options: {
            name: string;
            value: boolean;
        }[]
    }[]
}

export async function postDomanda(quest: DomandaDbDc) {
    try {        
        // first check if index already exists
        const domande = await db.query.domanda.findMany({
            where: eq(domanda.index, quest.index)
        });
        // if it does, modifiy each domanda with index greater than quest.index by 1
        if(domande.length > 0) {
            await db.update(domanda).set({ index: sql`${domanda.index} + 1` }).where(sql`${domanda.index} >= ${quest.index}`);
        }
        await db.insert(domanda).values(quest);
        return {success: true};
    } catch (error) {
        console.log(error);
        return {success: false, error};
    }
}

export async function putDomanda(id: number, quest: DomandaDbDc) {
    try {
        const q = await db.query.domanda.findMany({
            where: eq(domanda.id, id)
        });
        if(q.length === 0) return {success: false, error: 'domanda not found'};
        // check if index is being changed
        if(quest.index !== q[0]?.index) {
            if(q[0]?.index){
                // check who has the greater index
                if(quest.index > q[0]?.index) {
                    // index is being increased, so modify each domanda with index greater than q[0]?.index and less than or equal to quest.index by -1
                    await db.update(domanda).set({ index: sql`${domanda.index} - 1` }).where(sql`${domanda.index} > ${q[0]?.index} AND ${domanda.index} <= ${quest.index}`);
                }else{
                    // index is being decreased, so modify each domanda with index greater than or equal to quest.index and less than q[0]?.index by 1
                    await db.update(domanda).set({ index: sql`${domanda.index} + 1` }).where(sql`${domanda.index} >= ${quest.index} AND ${domanda.index} < ${q[0]?.index}`);
                }
            }
        }
        await db.update(domanda).set(quest).where(eq(domanda.id, id));
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }
}

export async function deleteDomanda(id: number) {
    try {
        const q = await db.query.domanda.findMany({
            where: eq(domanda.id, id)
        });
        if(q.length === 0) return {success: false, error: 'domanda not found'};
        // change index of all domande with index greater than id by -1
        await db.update(domanda).set({ index: sql`${domanda.index} - 1` }).where(sql`${domanda.index} > ${q[0]?.index}`);
        await db.delete(domanda).where(eq(domanda.id, id));
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


export async function postOutput(out: Output) {
    try {
        await db.insert(output).values(out);
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }
}

export async function getOutputs() {
    const out = await db.query.output.findMany();
    return out;
}

export async function getOutput(id: number) {
    const out = await db.query.output.findMany({
        where: eq(output.id, id)
    });
    return out[0];
}

export async function deleteOutput(id: number) {
    try {
        await db.delete(output).where(eq(output.id, id));
        return {success: true};
    } catch (error) {
        return {success: false, error};
    }
}
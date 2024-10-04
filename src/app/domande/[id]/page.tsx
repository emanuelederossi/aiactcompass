import React from 'react'
import { getCategories, getDomanda } from '~/server/actions';
import Form from './form';
import { DomandaDb } from '~/app/domande';

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
  }
  interface Action {
    category: string;
    value: string;
}
export default async function Page({ params }: { params: { id: string } }) {

    const domanda = await getDomanda(Number(params.id));
    const categories = await getCategories();
    // ensure categories is of type CategoryDb[]
    const formattedCategories: CategoryDb[] = categories.map(c => ({
        id: c.id,
        nome: c.nome,
        options: c.options as string[]
    }));

    if(!domanda) return <div>Domanda non trovata</div>

    const formattedDomanda: DomandaDb = {
        ...domanda,
        dependencies: domanda?.dependencies as { category: string; value: string[]; }[],
        options: domanda?.options as { name: string; actions?: Action[] | undefined; }[]
    }

    return (
        <div className='bg-slate-700 min-w-full min-h-screen'>
            <Form
            categories={formattedCategories}
            domanda={formattedDomanda}
            />
        </div>
    )
}

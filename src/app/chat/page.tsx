import React from 'react'
import InnerWrapper from './innerWrapper'
import { getCategories, getDomande, getOutputs } from '~/server/actions';
import { DomandaDb } from '../domande'; // Ensure you have the correct import for DomandaDb

interface Action {
  category: string;
  value: string;
}

interface Category {
  id: number;
  nome: string;
  options: string[];
}

interface Output {
  id: number;
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

const page = async() => {
 const domande = await getDomande();
 const categorie = await getCategories();
 const outputs = await getOutputs();
  // Ensure domande is of type DomandaDb[]
  const formattedDomande: DomandaDb[] = domande.map(d => ({
    ...d,
    dependencies: d.dependencies as { category: string; value: string[]; }[],
    options: d.options as { name: string; actions?: Action[] | undefined; }[]
  }));

  // Ensure categorie is of type Category[]
  const formattedCategorie: Category[] = categorie.map(c => ({
    id: c.id,
    nome: c.nome,
    options: c.options as string[]
  }));

  // Ensure outputs is of type Output[]
  const formattedOutputs: Output[] = outputs.map(o => ({
    id: o.id,
    title: o.title,
    content: o.content,
    categories: o.categories as { id: number; options: { name: string; value: boolean; }[] }[]
  }));

  return (
    <div className='flex justify-center'>  
    {formattedDomande && formattedCategorie && (
      <InnerWrapper 
      domande={formattedDomande} 
      categorie={formattedCategorie}
      outputs={formattedOutputs}
      />
    )}    
    </div>
  )
}

export default page

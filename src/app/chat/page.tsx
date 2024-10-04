import React from 'react'
import InnerWrapper from './innerWrapper'
import { getCategories, getDomande } from '~/server/actions';
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

const page = async() => {
 const domande = await getDomande();
 const categorie = await getCategories();
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
  return (
    <div className='flex justify-center'>  
    {formattedDomande && formattedCategorie && (
      <InnerWrapper domande={formattedDomande} categorie={formattedCategorie}/>
    )}    
    </div>
  )
}

export default page

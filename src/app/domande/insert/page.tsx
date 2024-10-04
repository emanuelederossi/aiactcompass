import React from 'react'
import Form from './form'
import { getCategories } from '~/server/actions';

interface CategoryDb {
    id: number;
    nome: string;
    options: string[];
  }

const page = async() => {
    const categories = await getCategories();
    // ensure categories is of type CategoryDb[]
    const formattedCategories: CategoryDb[] = categories.map(c => ({
        id: c.id,
        nome: c.nome,
        options: c.options as string[]
    }));


  return (
    <div>
      <Form categories={formattedCategories} />
    </div>
  )
}

export default page

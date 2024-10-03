interface Categoria {
    nome: string;
    options: string[];
}

export const categorie: Categoria[] = [
    {
        nome: 'role',
        options: [
            'Provider',
            'Deployer',
            'Importer',
            'Distributor',
            'Authorised Representative',
            'Product Manufacturer',
        ]
    },
    {
        nome: 'global',
        options: ['EXIT']
    },
    {
        nome: 'transparency obligations',
        options: ['true']
    }
]

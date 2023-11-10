import * as bcrypt from 'bcrypt';

interface SeedUser {
    name: string;
    email: string;
    password: string;
    roles: string[];
}

interface SeedData {
    users: SeedUser[];
}

export const initialData: SeedData = {
    users: [
        {
            name: 'Diego Huamani Luque',
            email: 'dhuamanilu@unsa.edu.pe',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['user', 'super-user'],
        },
        {
            name: 'Diego Pacori Anccasi',
            email: 'dpacoria@unsa.edu.pe',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['user', 'admin'],
        },
        {
            name: 'Gustavo Ordoño Poma',
            email: 'gordono@unsa.edu.pe',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['user'],
        },
        {
            name: 'Esteven Calcina',
            email: 'ecalcinap@unsa.edu.pe',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['user'],
        },
        {
            name: 'Franco Cárdenas',
            email: 'fcardenasm@unsa.edu.pe',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['user'],
        },
    ],
};

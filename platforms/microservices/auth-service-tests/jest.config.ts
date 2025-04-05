export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // Chemin des fichiers de test
    moduleFileExtensions: ['ts', 'js'],
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json', // Chemin vers votre fichier tsconfig
        },
    },
};

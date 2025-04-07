import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
require('dotenv').config();

/**
 * Script principal pour g�n�rer les DTOs depuis MongoDB et SQL Server
 * @author Mahmoud Charif - CESIMANGE-118 - 31/03/2025 - Creation
 */

// Chemin vers les scripts de g�n�ration
const MONGO_GENERATOR_PATH = path.join(__dirname,'src', 'mongoGenerator.ts');
const SQL_GENERATOR_PATH = path.join(__dirname,'src', 'sqlGenerator.ts');

// V�rifier que les scripts existent
if (!fs.existsSync(MONGO_GENERATOR_PATH))
{
    console.error(`Le script MongoDB n'existe pas au chemin: ${MONGO_GENERATOR_PATH}`);
    process.exit(1);
}

if (!fs.existsSync(SQL_GENERATOR_PATH))
{
    console.error(`Le script SQL Server n'existe pas au chemin: ${SQL_GENERATOR_PATH}`);
    process.exit(1);
}

console.log('D�marrage de la g�n�ration des DTOs...');

try
{
    //// Ex�cuter le script MongoDB
    console.log('G�n�ration depuis MongoDB...');
    execSync(`npx ts-node ${MONGO_GENERATOR_PATH}`, { stdio: 'inherit' });
    execSync(`npx ts-node ${MONGO_GENERATOR_PATH} --front`, { stdio: 'inherit' });

    // Ex�cuter le script SQL Server
    console.log('G�n�ration depuis SQL Server...');
    execSync(`npx ts-node ${SQL_GENERATOR_PATH}`, { stdio: 'inherit' });

    console.log('G�n�ration des DTOs termin�e avec succ�s!');
} catch (error)
{
    console.error('Erreur lors de la g�n�ration des DTOs:', error);
    process.exit(1);
}
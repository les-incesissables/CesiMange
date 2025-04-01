import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
require('dotenv').config();

/**
 * Script principal pour générer les DTOs depuis MongoDB et SQL Server
 * @author Mahmoud Charif - CESIMANGE-118 - 31/03/2025 - Creation
 */

// Chemin vers les scripts de génération
const MONGO_GENERATOR_PATH = path.join(__dirname,'src', 'mongoGenerator.ts');
const SQL_GENERATOR_PATH = path.join(__dirname,'src', 'sqlGenerator.ts');

// Vérifier que les scripts existent
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

console.log('Démarrage de la génération des DTOs...');

try
{
    //// Exécuter le script MongoDB
    console.log('Génération depuis MongoDB...');
    execSync(`npx ts-node ${MONGO_GENERATOR_PATH}`, { stdio: 'inherit' });

    // Exécuter le script SQL Server
    console.log('Génération depuis SQL Server...');
    execSync(`npx ts-node ${SQL_GENERATOR_PATH}`, { stdio: 'inherit' });

    console.log('Génération des DTOs terminée avec succès!');
} catch (error)
{
    console.error('Erreur lors de la génération des DTOs:', error);
    process.exit(1);
}
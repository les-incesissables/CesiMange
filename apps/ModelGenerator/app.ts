// generateDTOs.ts

import * as fs from 'fs';
import * as path from 'path';
import { MongoClient } from 'mongodb';

// Types pour le générateur
type SchemaType = 'String' | 'Number' | 'Boolean' | 'Date' | 'ObjectId' | 'Array' | 'Mixed' | 'Map' | 'Buffer';

//#region Interfaces
interface SchemaField
{
    type: SchemaType;
    ref?: string;
    isArray?: boolean;
    arrayType?: SchemaType;
    arrayRef?: string;
}

interface PropertyDefinition
{
    [key: string]: string;
}

interface KnownTypes
{
    [typeName: string]: PropertyDefinition;
}
//#endregion

// Configuration
const config = {
    modelsDir: './src/models',       // Répertoire des modèles
    outputDir: '../Express/models/',         // Répertoire où seront générés les DTOs
    baseImportPath: '../base',       // Chemin d'importation relatif pour les DTOs de base
    excludedFields: ['__v', 'deleted'], // Champs à exclure des DTOs
    excludedDirectories: ['buildenvironment', 'buildinfo', 'cmdline', 'net', 'openssl', 'startup_log', 'systemlog'],  // Dossiers à ne pas créer/traiter
    mongoUri: 'mongodb://localhost:27017/projet', // URL de connexion MongoDB
    sampleSize: 10,                  // Nombre de documents à analyser par collection
    cleanOutputDir: true,            // Nettoyer le répertoire de sortie avant de générer les nouveaux fichiers
};

//#region Methods
// Fonction pour créer le dossier de sortie s'il n'existe pas
function ensureDirectoryExists(directory: string): void
{
    if (!fs.existsSync(directory))
    {
        fs.mkdirSync(directory, { recursive: true });
    }
}

// Fonction pour nettoyer le répertoire de sortie
function cleanDirectory(directory: string): void
{
    if (fs.existsSync(directory))
    {
        fs.rmSync(directory, { recursive: true, force: true });
    }
    ensureDirectoryExists(directory);
}

// Inférer le type d'une valeur
function inferType(value: any): string
{
    if (value === null || value === undefined) return 'any';

    if (Array.isArray(value))
    {
        if (value.length === 0) return 'any[]';
        return `${inferType(value[0])}[]`;
    }

    if (value instanceof Date) return 'Date';

    // Pour les ObjectId de MongoDB
    if (value && typeof value === 'object' && value.toString && typeof value.toString === 'function' && /^[0-9a-fA-F]{24}$/.test(value.toString()))
    {
        return 'string';
    }

    if (typeof value === 'object')
    {
        return 'object';
    }

    return typeof value;
}

// Analyser un document MongoDB et déduire sa structure
function analyzeDocument(document: any, knownTypes: KnownTypes = {}): PropertyDefinition
{
    const structure: PropertyDefinition = {};

    Object.entries(document).forEach(([key, value]) =>
    {
        if (key === '_id')
        {
            structure['id'] = 'string';
            return;
        }

        if (config.excludedFields.includes(key))
        {
            return;
        }

        const type = inferType(value);

        if (type === 'object')
        {
            // Analyser les propriétés de l'objet
            const objectName = key.charAt(0).toUpperCase() + key.slice(1);
            if (!knownTypes[objectName])
            {
                knownTypes[objectName] = analyzeDocument(value, knownTypes);
            }
            structure[key] = objectName;
        } else if (type.endsWith('[]'))
        {
            // Si c'est un tableau, vérifier les éléments
            if (Array.isArray(value) && value.length > 0)
            {
                // Vérifier le premier élément pour déterminer le type
                const firstElement = value[0];
                if (typeof firstElement === 'object' && firstElement !== null && !(firstElement instanceof Date))
                {
                    // C'est un tableau d'objets - créer un type pour l'élément
                    const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
                    const elementTypeName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1);

                    if (!knownTypes[elementTypeName])
                    {
                        knownTypes[elementTypeName] = analyzeDocument(firstElement, knownTypes);
                    }

                    // Définir le type comme un tableau de ce type
                    structure[key] = `${elementTypeName}[]`;
                } else
                {
                    // Tableau de types primitifs
                    structure[key] = type;
                }
            } else
            {
                // Tableau vide ou non reconnu
                structure[key] = type;
            }
        } else
        {
            structure[key] = type;
        }
    });

    return structure;
}

// Fusionner plusieurs structures
function mergeStructures(structures: PropertyDefinition[]): PropertyDefinition
{
    const result: PropertyDefinition = {};

    structures.forEach(structure =>
    {
        Object.entries(structure).forEach(([key, type]) =>
        {
            // Si la clé existe déjà mais avec un type différent, utiliser any
            if (result[key] && result[key] !== type)
            {
                result[key] = 'any';
            } else
            {
                result[key] = type;
            }
        });
    });

    return result;
}

// Transformer la structure d'un DTO en structure de CritereDTO
function transformToCriteriaStructure(structure: PropertyDefinition, knownTypes: KnownTypes): PropertyDefinition
{
    const criteriaStructure: PropertyDefinition = {};

    // Copier tous les champs du DTO (par défaut "contient" pour les chaînes)
    Object.entries(structure).forEach(([key, type]) =>
    {
        if (key === 'id') return; // Déjà inclus dans BaseCritereDTO
        criteriaStructure[key] = type;
    });

    return criteriaStructure;
}



// Fonction utilitaire pour vérifier si un type est primitif
function isPrimitiveType(type: string): boolean
{
    const primitiveTypes = ['string', 'number', 'boolean', 'Date', 'any', 'object'];
    return primitiveTypes.some(pt => type === pt);
}

// Convertir un nom de collection en nom d'entité
function collectionToEntityName(collectionName: string): string
{
    return collectionName
        .replace(/^[_]/, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
        .replace(/s$/, ''); // Enlever le 's' final si présent
}

// Fonction pour déterminer si une collection doit être exclue
function shouldExcludeCollection(collectionName: string): boolean
{
    return config.excludedDirectories.includes(collectionName.toLowerCase());
}

//#region Generate

// Fonction pour générer le contenu du fichier DTO
function generateController(entityName: string): string
{
    const dtoImport = `import { ${entityName}DTO } from "../../models/${entityName.toLowerCase()}/${entityName}DTO";`;
    const critereImport = `import { ${entityName}CritereDTO } from "../../models/${entityName.toLowerCase()}/${entityName}CritereDTO";`;
    const baseControllerImport = `import { BaseController } from "../BaseController";`;
    const lGenerationDate = new Date().toISOString(); // Génère la date actuelle en format ISO

    return `${dtoImport}
${critereImport}
${baseControllerImport}

/**
 * Contrôleur pour l'entité ${entityName}
 * @Author ModelGenerator - ${lGenerationDate} - Création
 */
export class ${entityName}Controller extends BaseController<${entityName}DTO, ${entityName}CritereDTO> {
}`;
}

function generateMetier(entityName: string): string
{
    const dtoImport = `import { ${entityName}DTO } from "../../models/${entityName.toLowerCase()}/${entityName}DTO";`;
    const critereImport = `import { ${entityName}CritereDTO } from "../../models/${entityName.toLowerCase()}/${entityName}CritereDTO";`;
    const baseMetierImport = `import { BaseMetier } from "../base/BaseMetier";`;
    const repositoryImport = `import { Repository } from "../../DAL/repositories/base/Repository";`;
    const repoConfigImport = `import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";`;

    const generationDate = new Date().toISOString(); // Génère la date actuelle en format ISO

    return `${dtoImport}
${critereImport}
${baseMetierImport}
${repositoryImport}
${repoConfigImport}

/**
 * Métier pour l'entité ${entityName}
 * @Author ModelGenerator - ${generationDate} - Création
 */
export class ${entityName}Metier extends BaseMetier<${entityName}DTO, ${entityName}CritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: '${entityName.toLowerCase()}', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<${entityName}DTO, ${entityName}CritereDTO>(config);
        super(repo);
    }
}`;
}



// Fonction pour générer le contenu du fichier DTO
function generateDTOContent(entityName: string, structure: PropertyDefinition, knownTypes: KnownTypes, entityDir: string): string
{
    const imports = new Set<string>();
    imports.add(`import { BaseDTO } from "${config.baseImportPath}/BaseDTO";`);

    let properties = '';

    // Parcourir chaque propriété pour générer les imports et le contenu
    Object.entries(structure).forEach(([key, type]) =>
    {
        if (key === 'id') return; // id est déjà dans BaseDTO

        // Analyser le type pour déterminer s'il s'agit d'un type primitif ou complexe
        let baseType = type;
        let isArray = false;

        if (type.endsWith('[]'))
        {
            baseType = type.substring(0, type.length - 2);
            isArray = true;
        }

        // Si c'est un type personnalisé (non primitif)
        if (!isPrimitiveType(baseType))
        {
            // Importer le DTO correspondant
            const importPath = `../${baseType.toLowerCase()}/${baseType}DTO`;
            imports.add(`import { ${baseType}DTO } from "${importPath}";`);

            // Utiliser le type avec DTO dans la propriété
            if (isArray)
            {
                properties += `  ${key}?: ${baseType}DTO[];\n`;
            } else
            {
                properties += `  ${key}?: ${baseType}DTO;\n`;
            }
        } else
        {
            // Utiliser le type primitif tel quel
            properties += `  ${key}?: ${type};\n`;
        }
    });
    const lGenerationDate = new Date().toISOString(); // Génère la date actuelle en format ISO

    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * DTO pour l'entité ${entityName}
 * @Author ModelGenerator - ${lGenerationDate} - Création
 */
export class ${entityName}DTO extends BaseDTO {
${properties}}
`;
}

// Fonction pour générer le contenu du fichier CritereDTO
function generateCritereDTOContent(entityName: string, structure: PropertyDefinition, entityDir: string): string
{
    const imports = new Set<string>();
    imports.add(`import { BaseCritereDTO } from "${config.baseImportPath}/BaseCritereDTO";`);

    let properties = '';

    // Parcourir chaque propriété pour générer les imports et le contenu
    Object.entries(structure).forEach(([key, type]) =>
    {
        if (key === 'id') return; // id est déjà dans BaseCritereDTO

        // Analyser le type pour déterminer s'il s'agit d'un type primitif ou complexe
        let baseType = type;
        let isArray = false;

        if (type.endsWith('[]'))
        {
            baseType = type.substring(0, type.length - 2);
            isArray = true;
        }

        // Si c'est un type personnalisé (non primitif)
        if (!isPrimitiveType(baseType))
        {
            // Importer le DTO correspondant
            const importPath = `../${baseType.toLowerCase()}/${baseType}DTO`;
            const importPathCritere = `../${baseType.toLowerCase()}/${baseType}CritereDTO`;

            imports.add(`import { ${baseType}DTO } from "${importPath}";`);
            imports.add(`import { ${baseType}CritereDTO } from "${importPathCritere}";`);


            // Utiliser le type avec DTO dans la propriété
            if (isArray)
            {
                properties += `  ${key}?: ${baseType}DTO[];\n`;
                properties += `  ${key}Like?: ${baseType}CritereDTO;\n`;
            } else
            {
                properties += `  ${key}?: ${baseType}DTO;\n`;
                properties += `  ${key}Like?: ${baseType}CritereDTO;\n`;
            }
        } else
        {
            // Utiliser le type primitif tel quel
            properties += `  ${key}?: ${type};\n`;
            properties += `  ${key}Like?: ${type};\n`;
        }

    });
    const lGenerationDate = new Date().toISOString(); // Génère la date actuelle en format ISO

    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * Critères de recherche pour l'entité ${entityName}
 * @Author ModelGenerator - ${lGenerationDate} - Création
 */
export class ${entityName}CritereDTO extends BaseCritereDTO {
${properties}}
`;
}

function generateFiles(pEntityName: string, pCriteriaStructure: PropertyDefinition, pStructure : PropertyDefinition, pKnownTypes : KnownTypes): void
{
    // Créer le dossier pour l'entité
    const lEntityDir = path.join(config.outputDir, pEntityName.toLowerCase());
    ensureDirectoryExists(lEntityDir);

    // Générer et écrire le DTO
    const lDtoContent = generateDTOContent(pEntityName, pStructure, pKnownTypes, lEntityDir);
    fs.writeFileSync(path.join(lEntityDir, `${pEntityName}DTO.ts`), lDtoContent);

    // Générer et écrire le CritereDTO
    const lCritereDTOContent = generateCritereDTOContent(pEntityName, pCriteriaStructure, lEntityDir);
    fs.writeFileSync(path.join(lEntityDir, `${pEntityName}CritereDTO.ts`), lCritereDTOContent);

    // Créer le dossier pour l'entité
    const lControllerDir = path.join(config.outputDir.replace('models', 'controllers'), pEntityName.toLowerCase());
    ensureDirectoryExists(lControllerDir);

    // Générer et écrire le CritereDTO
    const lController = generateController(pEntityName);
    fs.writeFileSync(path.join(lControllerDir, `${pEntityName}Controller.ts`), lController);

    // Créer le dossier pour l'entité
    const lMetierDir = path.join(config.outputDir.replace('models', 'metier'), pEntityName.toLowerCase());
    ensureDirectoryExists(lMetierDir);

    // Générer et écrire le CritereDTO
    const lMetier = generateMetier(pEntityName);
    fs.writeFileSync(path.join(lMetierDir, `${pEntityName}Metier.ts`), lMetier);

    console.log(`  Fichiers générés pour ${pEntityName}`);
    return;
}

// Fonction principale pour générer les DTOs
async function generateDTOs(): Promise<void>
{
    let client: MongoClient | null = null;

    try
    {
        console.log('Démarrage de la génération des DTOs...');

        // Nettoyer et créer les répertoires nécessaires
        if (config.cleanOutputDir)
        {
            cleanDirectory(config.outputDir);
        } else
        {
            ensureDirectoryExists(config.outputDir);
        }

        ensureDirectoryExists(path.join(config.outputDir, 'base'));

        fs.writeFileSync(
            path.join(config.outputDir.replace('models', ''), 'interfaces', 'IBaseCritereDTO.ts'), fs.readFileSync('./src/interfaces/IBaseCritereDTO.ts'));

        // Générer les DTOs de base
        fs.writeFileSync(
            path.join(config.outputDir, 'base', 'BaseDTO.ts'), fs.readFileSync('./src/models/base/BaseDTO.ts'));

        fs.writeFileSync(
            path.join(config.outputDir, 'base', 'BaseCritereDTO.ts'), fs.readFileSync('./src/models/base/BaseCritereDTO.ts'));

        // Connexion à MongoDB
        client = new MongoClient(config.mongoUri);
        await client.connect();
        console.log('Connecté à MongoDB');

        const dbName = config.mongoUri.split('/').pop()?.split('?')[0] || '';
        const db = client.db(dbName);

        // Créer manuellement des exemples si aucune collection n'est trouvée
        const collections = await db.listCollections().toArray();

        if (collections.length > 0)
        {
            // Analyser les collections existantes
            console.log(`${collections.length} collections trouvées.`);

            const knownTypes: KnownTypes = {};
            const entityStructures: Record<string, PropertyDefinition> = {};

            // Première passe : analyser les documents de chaque collection
            for (const collection of collections)
            {
                const collectionName = collection.name;

                // Vérifier si la collection doit être exclue
                if (shouldExcludeCollection(collectionName))
                {
                    console.log(`Collection ${collectionName} exclue.`);
                    continue;
                }

                console.log(`Analyse de la collection ${collectionName}...`);

                // Obtenir des échantillons de documents
                const documents = await db.collection(collectionName)
                    .find()
                    .limit(config.sampleSize)
                    .toArray();

                if (documents.length === 0)
                {
                    console.log(`  Aucun document trouvé dans ${collectionName}, ignoré.`);
                    continue;
                }

                // Analyser les structures de documents
                const structures = documents.map(doc => analyzeDocument(doc, knownTypes));
                const mergedStructure = mergeStructures(structures);

                // Stocker la structure
                const entityName = collectionToEntityName(collectionName);
                entityStructures[entityName] = mergedStructure;
            }

            // Deuxième passe : générer les DTOs et CritereDTOs
            for (const [entityName, structure] of Object.entries(entityStructures))
            {
                // Vérifier si l'entité figure dans la liste des exclusions
                const entityLower = entityName.toLowerCase();
                if (config.excludedDirectories.some(dir => dir.toLowerCase() === entityLower))
                {
                    console.log(`Entité ${entityName} exclue.`);
                    continue;
                }

                console.log(`Génération des fichiers pour ${entityName}...`);

                // Transformer la structure en critères
                const criteriaStructure = transformToCriteriaStructure(structure, knownTypes);

                generateFiles(entityName, criteriaStructure, structure, knownTypes);
            }

            // Troisième passe : générer les DTOs et CritereDTOs pour les types complexes découverts
            for (const [typeName, structure] of Object.entries(knownTypes))
            {
                // Vérifier si le type figure dans la liste des exclusions
                const typeLower = typeName.toLowerCase();
                if (config.excludedDirectories.some(dir => dir.toLowerCase() === typeLower))
                {
                    console.log(`Type complexe ${typeName} exclu.`);
                    continue;
                }

                console.log(`Génération des fichiers pour le type complexe ${typeName}...`);

                // Transformer la structure en critères
                const criteriaStructure = transformToCriteriaStructure(structure, knownTypes);

                generateFiles(typeName, criteriaStructure, structure, knownTypes);

            }
        }

        console.log('Génération des DTOs terminée avec succès!');

    } catch (error)
    {
        console.error('Erreur lors de la génération des DTOs:', error);
    } finally
    {
        if (client)
        {
            await client.close();
            console.log('Déconnecté de MongoDB');
        }
    }
}

//#endregion

//#endregion

// Exécuter la génération
generateDTOs();
// generateDTOs.ts
import * as fs from 'fs';
import * as path from 'path';
import { MongoClient } from 'mongodb';

// Types pour le générateur
type SchemaType = 'String' | 'Number' | 'Boolean' | 'Date' | 'ObjectId' | 'Array' | 'Mixed' | 'Map' | 'Buffer';

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

// Configuration
const config = {
    modelsDir: './src/models',       // Répertoire des modèles
    outputDir: '../CesiMangeServer/models',         // Répertoire où seront générés les DTOs
    baseImportPath: '../base',       // Chemin d'importation relatif pour les DTOs de base
    excludedFields: ['__v', 'deleted'], // Champs à exclure des DTOs
    excludedDirectories: ['buildenvironment', 'buildinfo', 'cmdline', 'net', 'openssl', 'startup_log', 'systemlog'],  // Dossiers à ne pas créer/traiter
    mongoUri: 'mongodb://localhost:27017/local', // URL de connexion MongoDB
    sampleSize: 10,                  // Nombre de documents à analyser par collection
    cleanOutputDir: true,            // Nettoyer le répertoire de sortie avant de générer les nouveaux fichiers
};

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

// Convertir un type Mongoose en type TypeScript
function mongooseTypeToTypeScript(field: SchemaField): string
{
    const typeMap: Record<SchemaType, string> = {
        'String': 'string',
        'Number': 'number',
        'Boolean': 'boolean',
        'Date': 'Date',
        'ObjectId': 'string',
        'Array': 'any[]', // Sera remplacé si arrayType est défini
        'Mixed': 'any',
        'Map': 'Record<string, any>',
        'Buffer': 'Buffer',
    };

    if (field.isArray)
    {
        if (field.arrayRef)
        {
            return `${field.arrayRef}DTO[]`;
        } else if (field.arrayType)
        {
            return `${typeMap[field.arrayType]}[]`;
        } else
        {
            return 'any[]';
        }
    }

    if (field.ref)
    {
        return `${field.ref}DTO`;
    }

    return typeMap[field.type] || 'any';
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
// Dans la fonction analyzeDocument
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

// Calculer le chemin d'importation relatif
function calculateRelativeImportPath(fromDir: string, toDir: string, toFile: string): string
{
    const relativePath = path.relative(fromDir, toDir);
    return relativePath ? `${relativePath}/${toFile}` : `./${toFile}`;
}

// Fonction pour générer le contenu du fichier DTO avec imports génériques
// Fonction pour générer le contenu du fichier DTO avec imports cohérents
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

    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * DTO pour l'entité ${entityName}
 */
export interface ${entityName}DTO extends BaseDTO {
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

    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * Critères de recherche pour l'entité ${entityName}
 */
export interface ${entityName}CritereDTO extends BaseCritereDTO {
${properties}}
`;
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

        // Générer les DTOs de base
        fs.writeFileSync(
            path.join(config.outputDir, 'base', 'BaseDTO.ts'),
            `/**
 * DTO de base dont héritent tous les DTOs
 */
export interface BaseDTO {
  id?: string;
}
`
        );

        fs.writeFileSync(
            path.join(config.outputDir, 'base', 'BaseCritereDTO.ts'),
            `/**
 * Critères de base dont héritent tous les CritereDTOs
 */
export interface BaseCritereDTO {
  id?: string;
  ids?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  includeDeleted?: boolean;
}
`
        );

        // Connexion à MongoDB
        client = new MongoClient(config.mongoUri);
        await client.connect();
        console.log('Connecté à MongoDB');

        const dbName = config.mongoUri.split('/').pop()?.split('?')[0] || '';
        const db = client.db(dbName);

        // Créer manuellement des exemples si aucune collection n'est trouvée
        const collections = await db.listCollections().toArray();

        if (collections.length === 0)
        {
            console.log('Aucune collection trouvée. Création d\'exemples de DTOs...');

            // Créer des DTOs d'exemple
            const exampleEntities = [
                {
                    name: 'User',
                    structure: {
                        id: 'string',
                        username: 'string',
                        email: 'string',
                        isActive: 'boolean',
                        createdAt: 'Date',
                        roles: 'string[]'
                    }
                },
                {
                    name: 'Product',
                    structure: {
                        id: 'string',
                        name: 'string',
                        description: 'string',
                        price: 'number',
                        inStock: 'boolean',
                        categories: 'string[]'
                    }
                }
            ];

            const knownTypes: KnownTypes = {};

            for (const entity of exampleEntities)
            {
                console.log(`Génération des fichiers pour ${entity.name}...`);

                // Créer le dossier pour l'entité
                const entityDir = path.join(config.outputDir, entity.name.toLowerCase());
                ensureDirectoryExists(entityDir);

                // Générer la structure des critères
                const criteriaStructure = transformToCriteriaStructure(entity.structure, knownTypes);

                // Générer et écrire le DTO
                const dtoContent = generateDTOContent(entity.name, entity.structure, knownTypes, entityDir);
                fs.writeFileSync(path.join(entityDir, `${entity.name}DTO.ts`), dtoContent);

                // Générer et écrire le CritereDTO
                const critereDTOContent = generateCritereDTOContent(entity.name, criteriaStructure, entityDir);
                fs.writeFileSync(path.join(entityDir, `${entity.name}CritereDTO.ts`), critereDTOContent);

                console.log(`  Fichiers générés pour ${entity.name}`);
            }
        } else
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

                // Créer le dossier pour l'entité
                const entityDir = path.join(config.outputDir, entityName.toLowerCase());
                ensureDirectoryExists(entityDir);

                // Générer et écrire le DTO
                const dtoContent = generateDTOContent(entityName, structure, knownTypes, entityDir);
                fs.writeFileSync(path.join(entityDir, `${entityName}DTO.ts`), dtoContent);

                // Générer et écrire le CritereDTO
                const critereDTOContent = generateCritereDTOContent(entityName, criteriaStructure, entityDir);
                fs.writeFileSync(path.join(entityDir, `${entityName}CritereDTO.ts`), critereDTOContent);

                console.log(`  Fichiers générés pour ${entityName}`);
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

                // Créer le dossier pour le type
                const typeDir = path.join(config.outputDir, typeName.toLowerCase());
                ensureDirectoryExists(typeDir);

                // Générer et écrire le DTO
                const dtoContent = generateDTOContent(typeName, structure, knownTypes, typeDir);
                fs.writeFileSync(path.join(typeDir, `${typeName}DTO.ts`), dtoContent);

                // Générer et écrire le CritereDTO
                const critereDTOContent = generateCritereDTOContent(typeName, criteriaStructure, typeDir);
                fs.writeFileSync(path.join(typeDir, `${typeName}CritereDTO.ts`), critereDTOContent);

                console.log(`  Fichiers générés pour le type complexe ${typeName}`);
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

// Exécuter la génération
generateDTOs();
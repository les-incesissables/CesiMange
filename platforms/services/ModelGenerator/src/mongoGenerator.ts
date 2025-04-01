import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
require('dotenv').config();

// Configuration des services et des collections associées
const serviceConfigs = [
    {
        serviceName: 'user-service',
        collections: ['user', 'developer'],
        outputDir: '../../microservices/user-service/src/models/',
        metierDir: '../../microservices/user-service/src/metier/',
        controllerDir: '../../microservices/user-service/src/controllers/'
    },
    {
        serviceName: 'restaurant-service',
        collections: ['restaurant', 'component'],
        outputDir: '../../microservices/restaurant-service/src/models/',
        metierDir: '../../microservices/restaurant-service/src/metier/',
        controllerDir: '../../microservices/restaurant-service/src/controllers/'
    }
    //{
    //    serviceName: 'order-service',
    //    collections: ['order', 'commercial'],
    //    outputDir: '../order-service/src/models/',
    //    metierDir: '../order-service/src/metier/'
    //},
    //{
    //    serviceName: 'delivery-service',
    //    collections: ['deliverie'],
    //    outputDir: '../delivery-service/src/models/',
    //    metierDir: '../delivery-service/src/metier/'
    //},
    //{
    //    serviceName: 'notification-service',
    //    collections: ['notification'],
    //    outputDir: '../notification-service/src/models/',
    //    metierDir: '../notification-service/src/metier/'
    //},
    //{
    //    serviceName: 'technical-service',
    //    collections: ['technical'],
    //    outputDir: '../technical-service/src/models/',
    //    metierDir: '../technical-service/src/metier/'
    //}
];

// Configuration générale
const config = {
    excludedFields: ['__v'],         // Champs à exclure des modèles
    excludedCollections: ['buildenvironment', 'buildinfo', 'cmdline', 'net', 'openssl', 'startup_log', 'systemlog'],
    mongoUri: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/CesiMange',
    sampleSize: 10,                  // Nombre de documents à analyser par collection
    cleanOutputDir: true,            // Nettoyer le répertoire de sortie avant de générer les nouveaux fichiers
    protectedFolders: ['base']       // Dossiers à ne pas supprimer lors du nettoyage
};

// Structure des dossiers pour les modèles
const folders = {
    interfaces: 'interfaces',
    schemas: 'schemas',
    models: 'models',
};

// Types et interfaces pour l'analyse
interface FieldInfo
{
    type: string;
    mongooseType: string;
    isRequired: boolean;
    isArray: boolean;
    ref?: string;
}

interface CollectionSchema
{
    [fieldName: string]: FieldInfo;
}

// Fonction pour s'assurer qu'un répertoire existe
function ensureDirectoryExists(dirPath: string): void
{
    if (!fs.existsSync(dirPath))
    {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Fonction pour nettoyer un répertoire tout en préservant certains dossiers
function cleanDirectory(dirPath: string, preserveFolders: string[] = []): void
{
    if (fs.existsSync(dirPath))
    {
        fs.readdirSync(dirPath).forEach(file =>
        {
            const currentPath = path.join(dirPath, file);

            // Si c'est un dossier à préserver, on le garde
            if (fs.lstatSync(currentPath).isDirectory() && preserveFolders.includes(file))
            {
                console.log(`  Dossier préservé: ${file}`);
                return;
            }

            if (fs.lstatSync(currentPath).isDirectory())
            {
                cleanDirectory(currentPath, preserveFolders);
                try
                {
                    fs.rmdirSync(currentPath);
                } catch (err)
                {
                    console.warn(`  Impossible de supprimer le dossier ${currentPath}: ${err}`);
                }
            } else
            {
                fs.unlinkSync(currentPath);
            }
        });
    }
}

// Fonction pour convertir le nom d'une collection en nom de classe (PascalCase)
function collectionNameToClassName(name: string): string
{
    // Enlever le "s" final pour les pluriels
    const singularName = name.endsWith('s') ? name.slice(0, -1) : name;

    // Convertir en PascalCase
    return singularName
        .split(/[-_]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

// Fonction pour déterminer le type Mongoose à partir d'une valeur
function getMongooseType(value: any): { type: string; mongooseType: string; isArray: boolean; ref?: string }
{
    if (value === null || value === undefined)
    {
        return { type: 'any', mongooseType: 'Schema.Types.Mixed', isArray: false };
    }

    if (Array.isArray(value))
    {
        if (value.length === 0)
        {
            return { type: 'any[]', mongooseType: '[Schema.Types.Mixed]', isArray: true };
        }
        const elemType = getMongooseType(value[0]);
        return {
            type: `${elemType.type}[]`,
            mongooseType: `[${elemType.mongooseType}]`,
            isArray: true,
            ref: elemType.ref
        };
    }

    if (value instanceof Date)
    {
        return { type: 'Date', mongooseType: 'Date', isArray: false };
    }

    if (mongoose.Types.ObjectId.isValid(value) && typeof value !== 'number')
    {
        return {
            type: 'string',
            mongooseType: 'Schema.Types.ObjectId',
            isArray: false,
            ref: 'needs_manual_definition' // Référence à définir manuellement
        };
    }

    switch (typeof value)
    {
        case 'string':
            return { type: 'string', mongooseType: 'String', isArray: false };
        case 'number':
            if (Number.isInteger(value))
            {
                return { type: 'number', mongooseType: 'Number', isArray: false };
            }
            return { type: 'number', mongooseType: 'Number', isArray: false };
        case 'boolean':
            return { type: 'boolean', mongooseType: 'Boolean', isArray: false };
        case 'object':
            return { type: 'Record<string, any>', mongooseType: 'Schema.Types.Mixed', isArray: false };
        default:
            return { type: 'any', mongooseType: 'Schema.Types.Mixed', isArray: false };
    }
}

// Fonction pour analyser la structure d'une collection
async function analyzeCollection(collectionName: string): Promise<CollectionSchema>
{
    // S'assurer que db est défini
    const connection = mongoose.connection;
    if (!connection.db)
    {
        throw new Error('La connexion à la base de données n\'est pas établie');
    }

    const db = connection.db;
    const collection = db.collection(collectionName);

    // Récupérer un échantillon de documents
    const sampleDocs = await collection.find({}).limit(config.sampleSize).toArray();

    if (sampleDocs.length === 0)
    {
        console.log(`  La collection ${collectionName} est vide.`);
        return {};
    }

    const schema: CollectionSchema = {};
    const requiredFields = new Set<string>();

    // Première passe: identifier tous les champs possibles
    sampleDocs.forEach(doc =>
    {
        Object.keys(doc).forEach(field =>
        {
            if (!config.excludedFields.includes(field))
            {
                if (!schema[field])
                {
                    const typeInfo = getMongooseType(doc[field]);
                    schema[field] = {
                        ...typeInfo,
                        isRequired: true // Supposer d'abord que tous les champs sont requis
                    };
                    requiredFields.add(field);
                }
            }
        });
    });

    // Deuxième passe: vérifier quels champs sont réellement requis
    sampleDocs.forEach(doc =>
    {
        const docFields = new Set(Object.keys(doc));

        requiredFields.forEach(field =>
        {
            if (!docFields.has(field))
            {
                requiredFields.delete(field);
            }
        });
    });

    // Mettre à jour l'information de requis
    Object.keys(schema).forEach(field =>
    {
        schema[field].isRequired = requiredFields.has(field);
    });

    return schema;
}

// Fonction pour générer le contenu du fichier d'interface
function generateInterfaceContent(className: string, schema: CollectionSchema): string
{
    const interfaceName = `I${className}`;

    let content = `import { Document } from 'mongoose';\n\n`;
    content += `export interface ${interfaceName} extends Document {\n`;

    Object.keys(schema).forEach(field =>
    {
        if (field !== '_id')
        {
            const { type, isRequired } = schema[field];
            content += `  ${field}${isRequired ? '' : '?'}: ${type};\n`;
        }
    });

    content += `}\n`;

    return content;
}

// Fonction pour initialiser les dossiers d'un service
function initializeServiceFolders(serviceConfig: typeof serviceConfigs[0]): void
{
    const { outputDir, metierDir } = serviceConfig;

    // Initialiser le dossier des modèles
    if (config.cleanOutputDir && fs.existsSync(outputDir))
    {
        cleanDirectory(outputDir, config.protectedFolders);
        console.log(`Répertoire nettoyé: ${outputDir}`);
    }
    ensureDirectoryExists(outputDir);

    // Créer les sous-répertoires pour les modèles
    for (const folder of Object.values(folders))
    {
        ensureDirectoryExists(path.join(outputDir, folder));
    }

    // Initialiser le dossier métier
    if (fs.existsSync(metierDir))
    {
        // Nettoyer en préservant le dossier base
        cleanDirectory(metierDir, config.protectedFolders);
        console.log(`Répertoire métier nettoyé: ${metierDir} (en préservant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(metierDir);

    console.log(`Dossiers initialisés pour ${serviceConfig.serviceName}`);
}

// Fonction pour générer le contenu du fichier contrôleur
function generateControllerContent(className: string, collectionName: string): string
{
    const interfaceName = `I${className}`;

    let content = `import { ${interfaceName} } from "../../models/interfaces/${interfaceName}";\n`;
    content += `import { BaseController } from "../../../../base-classes/controllers/base/BaseController";\n\n\n`;
    content += `/**\n`;
    content += ` * Contrôleur pour l'entité ${className}\n`;
    content += ` * @Author ModelGenerator - ${new Date().toISOString()} - Création\n`;
    content += ` */\n`;
    content += `export class ${className}Controller extends BaseController<${interfaceName}, Partial<${interfaceName}>> {\n`;
    content += `}\n`;

    return content;
}

// Fonction pour générer le contenu du fichier métier mis à jour
function generateMetierContent(className: string, collectionName: string): string
{
    const interfaceName = `I${className}`;

    let content = `import { ${interfaceName} } from "../../models/interfaces/${interfaceName}";\n`;
    content += `import { BaseMetier } from "../../../../base-classes/metier/base/BaseMetier";\n\n\n`;
    content += `/**\n`;
    content += ` * Métier pour l'entité ${className}\n`;
    content += ` * @Author ModelGenerator - ${new Date().toISOString()} - Création\n`;
    content += ` */\n`;
    content += `export class ${className}Metier extends BaseMetier<${interfaceName}, Partial<${interfaceName}>> {\n`;
    content += `    constructor() {\n`;
    content += `        super('${collectionName}');\n`;
    content += `    }\n`;
    content += `}\n`;

    return content;
}

// Fonction pour initialiser le dossier des contrôleurs d'un service
function initializeControllerFolder(controllerDir: string): void
{
    // Initialiser le dossier des contrôleurs
    if (fs.existsSync(controllerDir))
    {
        // Nettoyer en préservant le dossier base
        cleanDirectory(controllerDir, config.protectedFolders);
        console.log(`Répertoire des contrôleurs nettoyé: ${controllerDir} (en préservant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(controllerDir);

    // S'assurer que le dossier "base" existe
    const baseDir = path.join(controllerDir, 'base');
    ensureDirectoryExists(baseDir);
}

// Fonction pour initialiser les dossiers métier d'un service
function initializeMetierFolder(metierDir: string): void
{
    // Initialiser le dossier métier
    if (fs.existsSync(metierDir))
    {
        // Nettoyer en préservant le dossier base
        cleanDirectory(metierDir, config.protectedFolders);
        console.log(`Répertoire métier nettoyé: ${metierDir} (en préservant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(metierDir);

    // S'assurer que le dossier "base" existe
    const baseDir = path.join(metierDir, 'base');
    ensureDirectoryExists(baseDir);
}

// Modifier la fonction principale pour inclure la génération des contrôleurs

// Modifier la fonction principale pour inclure la génération des contrôleurs
async function generateModels(): Promise<void>
{
    try
    {
        console.log('Démarrage de la génération des modèles, métiers et contrôleurs...');

        // Connexion à MongoDB avec Mongoose
        await mongoose.connect(config.mongoUri);
        console.log('Connecté à MongoDB avec Mongoose');

        // Vérifier que la connexion est établie
        if (!mongoose.connection.db)
        {
            throw new Error('La connexion à la base de données n\'est pas établie');
        }

        // Récupérer toutes les collections et les filtrer
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const allCollections = collections
            .map(c => c.name)
            .filter(name => !config.excludedCollections.includes(name));

        console.log(`${allCollections.length} collections trouvées après filtrage initial.`);

        // Pour chaque service configuré
        for (const serviceConfig of serviceConfigs)
        {
            console.log(`\nTraitement du service: ${serviceConfig.serviceName}`);

            // Initialiser les dossiers pour ce service
            initializeServiceFolders(serviceConfig);

            // Initialiser le dossier des contrôleurs si spécifié
            if (serviceConfig.controllerDir)
            {
                initializeControllerFolder(serviceConfig.controllerDir);
            }

            // Initialiser le dossier des métiers
            initializeMetierFolder(serviceConfig.metierDir);

            // Filtrer les collections pour ce service
            const serviceCollections = allCollections.filter(name =>
                serviceConfig.collections.includes(name)
            );

            console.log(`${serviceCollections.length} collections associées à ce service.`);

            // Traiter chaque collection pour ce service
            for (const collectionName of serviceCollections)
            {
                console.log(`Analyse de la collection: ${collectionName}`);

                const schema = await analyzeCollection(collectionName);

                if (Object.keys(schema).length > 0)
                {
                    const className = collectionNameToClassName(collectionName);
                    const interfaceName = `I${className}`;

                    // Générer le fichier d'interface
                    const interfaceContent = generateInterfaceContent(className, schema);
                    const interfaceFilePath = path.join(serviceConfig.outputDir, folders.interfaces, `${interfaceName}.ts`);
                    fs.writeFileSync(interfaceFilePath, interfaceContent);
                    console.log(`  Interface générée: ${interfaceFilePath}`);

                    // Créer le dossier métier pour cette entité
                    const metierEntityDir = path.join(serviceConfig.metierDir, collectionName);
                    ensureDirectoryExists(metierEntityDir);

                    // Générer le fichier métier
                    const metierContent = generateMetierContent(className, collectionName);
                    const metierFilePath = path.join(metierEntityDir, `${className}Metier.ts`);
                    fs.writeFileSync(metierFilePath, metierContent);
                    console.log(`  Métier généré: ${metierFilePath}`);

                    // Générer le fichier contrôleur si le dossier est spécifié
                    if (serviceConfig.controllerDir)
                    {
                        // Créer le dossier contrôleur pour cette entité
                        const controllerEntityDir = path.join(serviceConfig.controllerDir, collectionName);
                        ensureDirectoryExists(controllerEntityDir);

                        const controllerContent = generateControllerContent(className, collectionName);
                        const controllerFilePath = path.join(controllerEntityDir, `${className}Controller.ts`);
                        fs.writeFileSync(controllerFilePath, controllerContent);
                        console.log(`  Contrôleur généré: ${controllerFilePath}`);
                    }
                } else
                {
                    console.log(`  Aucun modèle généré pour ${collectionName} (collection vide ou structure non détectée).`);
                }
            }
        }

        console.log('\nGénération des modèles, métiers et contrôleurs terminée avec succès pour tous les services!');

    } catch (error)
    {
        console.error('Erreur lors de la génération des modèles, métiers et contrôleurs:', error);
    } finally
    {
        // Fermer la connexion Mongoose
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');
    }
}

// Exécuter la génération
generateModels();
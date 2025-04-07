"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const lFrontPath = '../../../apps/customer-final/front/src/models/';
// Configuration g�n�rale
const config = {
    excludedFields: ['__v'], // Champs � exclure des mod�les
    excludedCollections: ['buildenvironment', 'buildinfo', 'cmdline', 'net', 'openssl', 'startup_log', 'systemlog'],
    mongoUri: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/CesiMange',
    sampleSize: 10, // Nombre de documents � analyser par collection
    cleanOutputDir: true, // Nettoyer le r�pertoire de sortie avant de g�n�rer les nouveaux fichiers
    protectedFolders: ['base'], // Dossiers � ne pas supprimer lors du nettoyage
    front: true
};
// Configuration des services et des collections associ�es
const serviceConfigs = [
    {
        serviceName: 'user-service',
        collections: ['customer_profiles'],
        outputDir: !config.front ? '../../microservices/user-service/src/models/' : lFrontPath,
        metierDir: '../../microservices/user-service/src/metier/',
        controllerDir: '../../microservices/user-service/src/controllers/'
    },
    {
        serviceName: 'restaurant-service',
        collections: ['restaurants'],
        outputDir: !config.front ? '../../microservices/restaurant-service/src/models/' : lFrontPath,
        metierDir: '../../microservices/restaurant-service/src/metier/',
        controllerDir: '../../microservices/restaurant-service/src/controllers/'
    },
    {
        serviceName: 'order-service',
        collections: ['orders'],
        outputDir: !config.front ? '../../microservices/order-service/src/models/' : lFrontPath,
        metierDir: '../../microservices/order-service/src/metier/',
        controllerDir: '../../microservices/order-service/src/controllers/'
    }
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
// Structure des dossiers pour les mod�les
const folders = {
    interfaces: 'interfaces',
    models: 'models',
};
// Fonction pour s'assurer qu'un r�pertoire existe
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
// Fonction pour nettoyer un r�pertoire tout en pr�servant certains dossiers
function cleanDirectory(dirPath, preserveFolders = []) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(file => {
            const currentPath = path.join(dirPath, file);
            // Si c'est un dossier � pr�server, on le garde
            if (fs.lstatSync(currentPath).isDirectory() && preserveFolders.includes(file)) {
                console.log(`  Dossier pr�serv�: ${file}`);
                return;
            }
            if (fs.lstatSync(currentPath).isDirectory()) {
                cleanDirectory(currentPath, preserveFolders);
                try {
                    fs.rmdirSync(currentPath);
                }
                catch (err) {
                    console.warn(`  Impossible de supprimer le dossier ${currentPath}: ${err}`);
                }
            }
            else {
                fs.unlinkSync(currentPath);
            }
        });
    }
}
// Fonction pour convertir le nom d'une collection ou d'un champ en nom de classe (PascalCase)
function toPascalCase(name) {
    // Convertir en PascalCase
    return name
        .split(/[-_]/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}
// Fonction pour convertir le nom d'une collection en nom de classe (PascalCase)
function collectionNameToClassName(name) {
    // Enlever le "s" final pour les pluriels
    const singularName = name.endsWith('s') ? name.slice(0, -1) : name;
    return toPascalCase(singularName);
}
// Fonction pour analyser les objets imbriqu�s
function analyzeNestedObject(obj) {
    const nestedSchema = {};
    Object.keys(obj).forEach(field => {
        if (!config.excludedFields.includes(field)) {
            const typeInfo = getMongooseType(obj[field], field);
            nestedSchema[field] = Object.assign(Object.assign({}, typeInfo), { isRequired: true // Par d�faut, on suppose que tous les champs de l'objet imbriqu� sont requis
             });
        }
    });
    return nestedSchema;
}
// Fonction pour d�terminer le type Mongoose � partir d'une valeur
function getMongooseType(value, pField) {
    if (value === null || value === undefined) {
        return { type: 'any', mongooseType: 'Schema.Types.Mixed', isArray: false };
    }
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return { type: 'any[]', mongooseType: '[Schema.Types.Mixed]', isArray: true };
        }
        // Si le premier �l�ment du tableau est un objet (autre que Date ou ObjectId), il pourrait �tre un objet imbriqu�
        if (typeof value[0] === 'object' && value[0] !== null && !(value[0] instanceof Date) && !mongoose_1.default.Types.ObjectId.isValid(value[0])) {
            const nestedSchema = analyzeNestedObject(value[0]);
            return {
                type: `I${toPascalCase(pField || 'NestedItem')}[]`,
                mongooseType: '[new Schema({...})]',
                isArray: true,
                isNestedObject: true,
                nestedSchema
            };
        }
        const elemType = getMongooseType(value[0]);
        return {
            type: `${elemType.type}[]`,
            mongooseType: `[${elemType.mongooseType}]`,
            isArray: true,
            ref: elemType.ref
        };
    }
    if (value instanceof Date) {
        return { type: 'Date', mongooseType: 'Date', isArray: false };
    }
    if (mongoose_1.default.Types.ObjectId.isValid(value) && typeof value !== 'number') {
        return {
            type: 'string',
            mongooseType: 'Schema.Types.ObjectId',
            isArray: false,
            ref: 'needs_manual_definition' // R�f�rence � d�finir manuellement
        };
    }
    switch (typeof value) {
        case 'string':
            return { type: 'string', mongooseType: 'String', isArray: false };
        case 'number':
            if (Number.isInteger(value)) {
                return { type: 'number', mongooseType: 'Number', isArray: false };
            }
            return { type: 'number', mongooseType: 'Number', isArray: false };
        case 'boolean':
            return { type: 'boolean', mongooseType: 'Boolean', isArray: false };
        case 'object':
            // Si c'est un objet (autre que ceux d�j� trait�s), c'est un objet imbriqu�
            const nestedSchema = analyzeNestedObject(value);
            let lResult = {
                type: `I${toPascalCase(pField || 'NestedObject')}`,
                mongooseType: 'new Schema({...})',
                isArray: false,
                isNestedObject: true,
                nestedSchema
            };
            return lResult;
        default:
            return { type: 'any', mongooseType: 'Schema.Types.Mixed', isArray: false };
    }
}
// Fonction pour analyser la structure d'une collection
function analyzeCollection(collectionName) {
    return __awaiter(this, void 0, void 0, function* () {
        // S'assurer que db est d�fini
        const connection = mongoose_1.default.connection;
        if (!connection.db) {
            throw new Error('La connexion � la base de donn�es n\'est pas �tablie');
        }
        const db = connection.db;
        const collection = db.collection(collectionName);
        // R�cup�rer un �chantillon de documents
        const sampleDocs = yield collection.find({}).limit(config.sampleSize).toArray();
        if (sampleDocs.length === 0) {
            console.log(`  La collection ${collectionName} est vide.`);
            return { mainSchema: {}, nestedSchemas: new Map() };
        }
        const mainSchema = {};
        const nestedSchemas = new Map();
        const requiredFields = new Set();
        // Premi�re passe: identifier tous les champs possibles
        sampleDocs.forEach(doc => {
            Object.keys(doc).forEach(field => {
                if (!config.excludedFields.includes(field)) {
                    if (!mainSchema[field]) {
                        const typeInfo = getMongooseType(doc[field], field);
                        mainSchema[field] = Object.assign(Object.assign({}, typeInfo), { isRequired: true // Supposer d'abord que tous les champs sont requis
                         });
                        requiredFields.add(field);
                        // Si c'est un objet imbriqu�, ajouter son sch�ma � la liste des sch�mas imbriqu�s
                        if (typeInfo.isNestedObject && typeInfo.nestedSchema) {
                            let nestedName;
                            nestedName = `I${toPascalCase(field)}`;
                            nestedSchemas.set(nestedName, typeInfo.nestedSchema);
                            // V�rifier si l'objet imbriqu� contient lui-m�me des objets imbriqu�s
                            for (const [nestedField, nestedFieldInfo] of Object.entries(typeInfo.nestedSchema)) {
                                if (nestedFieldInfo.isNestedObject && nestedFieldInfo.nestedSchema) {
                                    let deepNestedName;
                                    deepNestedName = `I${toPascalCase(nestedField)}`;
                                    nestedSchemas.set(deepNestedName, nestedFieldInfo.nestedSchema);
                                }
                            }
                        }
                    }
                }
            });
        });
        // Deuxi�me passe: v�rifier quels champs sont r�ellement requis
        sampleDocs.forEach(doc => {
            const docFields = new Set(Object.keys(doc));
            requiredFields.forEach(field => {
                if (!docFields.has(field)) {
                    requiredFields.delete(field);
                }
            });
        });
        // Mettre � jour l'information de requis
        Object.keys(mainSchema).forEach(field => {
            mainSchema[field].isRequired = requiredFields.has(field);
        });
        return { mainSchema, nestedSchemas };
    });
}
// Fonction pour g�n�rer le contenu du fichier d'interface
function generateInterfaceContent(className, schema, isNested = false) {
    const interfaceName = `I${className}`;
    let content = isNested ? '' : `import { Document } from 'mongoose';\n\n`;
    // Ajouter les importations pour les interfaces imbriqu�es si n�cessaire
    const neededImports = new Set();
    Object.values(schema).forEach(fieldInfo => {
        if (fieldInfo.isNestedObject) {
            const nestedType = fieldInfo.isArray
                ? fieldInfo.type.replace('[]', '')
                : fieldInfo.type;
            neededImports.add(`import { ${nestedType} } from './${nestedType}';\n`);
        }
    });
    if (neededImports.size > 0) {
        content += Array.from(neededImports).join('');
        content += '\n';
    }
    content += `export interface ${interfaceName}${isNested ? '' : ' extends Document'} {\n`;
    Object.keys(schema).forEach(field => {
        if (field !== '_id' || isNested) {
            const { type, isRequired } = schema[field];
            content += `  ${field}${isRequired ? '' : '?'}: ${type};\n`;
        }
    });
    content += `}\n`;
    return content;
}
// Fonction pour initialiser les dossiers d'un service
function initializeServiceFolders(serviceConfig) {
    const { outputDir, metierDir } = serviceConfig;
    // Initialiser le dossier des mod�les
    if (config.cleanOutputDir && fs.existsSync(outputDir)) {
        cleanDirectory(outputDir, config.protectedFolders);
        console.log(`R�pertoire nettoy�: ${outputDir}`);
    }
    ensureDirectoryExists(outputDir);
    // Cr�er les sous-r�pertoires pour les mod�les
    for (const folder of Object.values(folders)) {
        ensureDirectoryExists(path.join(outputDir, folder));
    }
    // Initialiser le dossier m�tier
    if (fs.existsSync(metierDir)) {
        // Nettoyer en pr�servant le dossier base
        cleanDirectory(metierDir, config.protectedFolders);
        console.log(`R�pertoire m�tier nettoy�: ${metierDir} (en pr�servant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(metierDir);
    console.log(`Dossiers initialis�s pour ${serviceConfig.serviceName}`);
}
// Fonction pour g�n�rer le contenu du fichier contr�leur
function generateControllerContent(className, collectionName) {
    const interfaceName = `I${className}`;
    let content = `import { ${interfaceName} } from "../../models/interfaces/${interfaceName}";\n`;
    content += `import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";\n\n\n`;
    content += `/**\n`;
    content += ` * Contr�leur pour l'entit� ${className}\n`;
    content += ` * @Author ModelGenerator - ${new Date().toISOString()} - Cr�ation\n`;
    content += ` */\n`;
    content += `export class ${className}Controller extends BaseController<${interfaceName}, Partial<${interfaceName}>> {\n`;
    content += `}\n`;
    return content;
}
// Fonction pour g�n�rer le contenu du fichier m�tier mis � jour
function generateMetierContent(className, collectionName) {
    const interfaceName = `I${className}`;
    let content = `import { ${interfaceName} } from "../../models/interfaces/${interfaceName}";\n`;
    content += `import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";\n\n\n`;
    content += `/**\n`;
    content += ` * M�tier pour l'entit� ${className}\n`;
    content += ` * @Author ModelGenerator - ${new Date().toISOString()} - Cr�ation\n`;
    content += ` */\n`;
    content += `export class ${className}Metier extends BaseMetier<${interfaceName}, Partial<${interfaceName}>> {\n`;
    content += `    constructor() {\n`;
    content += `        super('${collectionName}');\n`;
    content += `    }\n`;
    content += `}\n`;
    return content;
}
// Fonction pour initialiser le dossier des contr�leurs d'un service
function initializeControllerFolder(controllerDir) {
    // Initialiser le dossier des contr�leurs
    if (fs.existsSync(controllerDir)) {
        // Nettoyer en pr�servant le dossier base
        cleanDirectory(controllerDir, config.protectedFolders);
        console.log(`R�pertoire des contr�leurs nettoy�: ${controllerDir} (en pr�servant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(controllerDir);
    // S'assurer que le dossier "base" existe
    const baseDir = path.join(controllerDir, 'base');
    ensureDirectoryExists(baseDir);
}
// Fonction pour initialiser les dossiers m�tier d'un service
function initializeMetierFolder(metierDir) {
    // Initialiser le dossier m�tier
    if (fs.existsSync(metierDir)) {
        // Nettoyer en pr�servant le dossier base
        cleanDirectory(metierDir, config.protectedFolders);
        console.log(`R�pertoire m�tier nettoy�: ${metierDir} (en pr�servant ${config.protectedFolders.join(', ')})`);
    }
    ensureDirectoryExists(metierDir);
    // S'assurer que le dossier "base" existe
    const baseDir = path.join(metierDir, 'base');
    ensureDirectoryExists(baseDir);
}
// Fonction principale modifi�e pour g�rer les objets imbriqu�s
function generateModels() {
    return __awaiter(this, arguments, void 0, function* (pFront = false) {
        try {
            console.log('D�marrage de la g�n�ration des mod�les, m�tiers et contr�leurs...');
            // Connexion � MongoDB avec Mongoose
            yield mongoose_1.default.connect(config.mongoUri);
            console.log('Connect� � MongoDB avec Mongoose');
            // V�rifier que la connexion est �tablie
            if (!mongoose_1.default.connection.db) {
                throw new Error('La connexion � la base de donn�es n\'est pas �tablie');
            }
            // R�cup�rer toutes les collections et les filtrer
            const db = mongoose_1.default.connection.db;
            const collections = yield db.listCollections().toArray();
            const allCollections = collections
                .map(c => c.name)
                .filter(name => !config.excludedCollections.includes(name));
            console.log(`${allCollections.length} collections trouv�es apr�s filtrage initial.`);
            // Pour chaque service configur�
            for (const serviceConfig of serviceConfigs) {
                console.log(`\nTraitement du service: ${serviceConfig.serviceName}`);
                // Initialiser les dossiers pour ce service
                initializeServiceFolders(serviceConfig);
                if (!pFront) {
                    // Initialiser le dossier des contr�leurs si sp�cifi�
                    if (serviceConfig.controllerDir) {
                        initializeControllerFolder(serviceConfig.controllerDir);
                    }
                    // Initialiser le dossier des m�tiers
                    initializeMetierFolder(serviceConfig.metierDir);
                }
                // Filtrer les collections pour ce service
                const serviceCollections = allCollections.filter(name => serviceConfig.collections.includes(name));
                console.log(`${serviceCollections.length} collections associ�es � ce service.`);
                // Traiter chaque collection pour ce service
                for (const collectionName of serviceCollections) {
                    console.log(`Analyse de la collection: ${collectionName}`);
                    const { mainSchema, nestedSchemas } = yield analyzeCollection(collectionName);
                    if (Object.keys(mainSchema).length > 0) {
                        const className = collectionNameToClassName(collectionName);
                        const interfaceName = `I${className}`;
                        // G�n�rer les interfaces pour les objets imbriqu�s d'abord
                        for (const [nestedName, nestedSchema] of nestedSchemas) {
                            const nestedClassName = nestedName.substring(1); // Enlever le "I" initial
                            const nestedInterfaceContent = generateInterfaceContent(nestedClassName, nestedSchema, true);
                            const nestedInterfaceFilePath = path.join(serviceConfig.outputDir, folders.interfaces, `${nestedName}.ts`);
                            fs.writeFileSync(nestedInterfaceFilePath, nestedInterfaceContent);
                            console.log(`  Interface imbriqu�e g�n�r�e: ${nestedInterfaceFilePath}`);
                        }
                        // G�n�rer le fichier d'interface principal
                        const interfaceContent = generateInterfaceContent(className, mainSchema);
                        const interfaceFilePath = path.join(serviceConfig.outputDir, folders.interfaces, `${interfaceName}.ts`);
                        fs.writeFileSync(interfaceFilePath, interfaceContent);
                        console.log(`  Interface principale g�n�r�e: ${interfaceFilePath}`);
                        if (!pFront) {
                            // Cr�er le dossier m�tier pour cette entit�
                            const metierEntityDir = path.join(serviceConfig.metierDir, collectionName);
                            ensureDirectoryExists(metierEntityDir);
                            // G�n�rer le fichier m�tier
                            const metierContent = generateMetierContent(className, collectionName);
                            const metierFilePath = path.join(metierEntityDir, `${className}Metier.ts`);
                            fs.writeFileSync(metierFilePath, metierContent);
                            console.log(`  M�tier g�n�r�: ${metierFilePath}`);
                            // G�n�rer le fichier contr�leur si le dossier est sp�cifi�
                            if (serviceConfig.controllerDir) {
                                // Cr�er le dossier contr�leur pour cette entit�
                                const controllerEntityDir = path.join(serviceConfig.controllerDir, collectionName);
                                ensureDirectoryExists(controllerEntityDir);
                                const controllerContent = generateControllerContent(className, collectionName);
                                const controllerFilePath = path.join(controllerEntityDir, `${className}Controller.ts`);
                                fs.writeFileSync(controllerFilePath, controllerContent);
                                console.log(`  Contr�leur g�n�r�: ${controllerFilePath}`);
                            }
                        }
                    }
                    else {
                        console.log(`  Aucun mod�le g�n�r� pour ${collectionName} (collection vide ou structure non d�tect�e).`);
                    }
                }
            }
            console.log('\nG�n�ration des mod�les, m�tiers et contr�leurs termin�e avec succ�s pour tous les services!');
        }
        catch (error) {
            console.error('Erreur lors de la g�n�ration des mod�les, m�tiers et contr�leurs:', error);
        }
        finally {
            // Fermer la connexion Mongoose
            yield mongoose_1.default.disconnect();
            console.log('D�connect� de MongoDB');
        }
    });
}
// Ex�cuter la g�n�ration
generateModels();
//# sourceMappingURL=mongoGenerator.js.map
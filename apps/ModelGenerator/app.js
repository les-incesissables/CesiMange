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
Object.defineProperty(exports, "__esModule", { value: true });
// generateDTOs.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mongodb_1 = require("mongodb");
// Configuration
const config = {
    modelsDir: './src/models', // R�pertoire des mod�les
    outputDir: '../CesiMangeServer/models', // R�pertoire o� seront g�n�r�s les DTOs
    baseImportPath: '../base', // Chemin d'importation relatif pour les DTOs de base
    excludedFields: ['__v', 'deleted'], // Champs � exclure des DTOs
    excludedDirectories: ['buildenvironment', 'buildinfo', 'cmdline', 'net', 'openssl', 'startup_log', 'systemlog'], // Dossiers � ne pas cr�er/traiter
    mongoUri: 'mongodb://localhost:27017/projet', // URL de connexion MongoDB
    sampleSize: 10, // Nombre de documents � analyser par collection
    cleanOutputDir: true, // Nettoyer le r�pertoire de sortie avant de g�n�rer les nouveaux fichiers
};
// Fonction pour cr�er le dossier de sortie s'il n'existe pas
function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}
// Fonction pour nettoyer le r�pertoire de sortie
function cleanDirectory(directory) {
    if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true, force: true });
    }
    ensureDirectoryExists(directory);
}
// Inf�rer le type d'une valeur
function inferType(value) {
    if (value === null || value === undefined)
        return 'any';
    if (Array.isArray(value)) {
        if (value.length === 0)
            return 'any[]';
        return `${inferType(value[0])}[]`;
    }
    if (value instanceof Date)
        return 'Date';
    // Pour les ObjectId de MongoDB
    if (value && typeof value === 'object' && value.toString && typeof value.toString === 'function' && /^[0-9a-fA-F]{24}$/.test(value.toString())) {
        return 'string';
    }
    if (typeof value === 'object') {
        return 'object';
    }
    return typeof value;
}
// Analyser un document MongoDB et d�duire sa structure
// Dans la fonction analyzeDocument
function analyzeDocument(document, knownTypes = {}) {
    const structure = {};
    Object.entries(document).forEach(([key, value]) => {
        if (key === '_id') {
            structure['id'] = 'string';
            return;
        }
        if (config.excludedFields.includes(key)) {
            return;
        }
        const type = inferType(value);
        if (type === 'object') {
            // Analyser les propri�t�s de l'objet
            const objectName = key.charAt(0).toUpperCase() + key.slice(1);
            if (!knownTypes[objectName]) {
                knownTypes[objectName] = analyzeDocument(value, knownTypes);
            }
            structure[key] = objectName;
        }
        else if (type.endsWith('[]')) {
            // Si c'est un tableau, v�rifier les �l�ments
            if (Array.isArray(value) && value.length > 0) {
                // V�rifier le premier �l�ment pour d�terminer le type
                const firstElement = value[0];
                if (typeof firstElement === 'object' && firstElement !== null && !(firstElement instanceof Date)) {
                    // C'est un tableau d'objets - cr�er un type pour l'�l�ment
                    const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
                    const elementTypeName = singularKey.charAt(0).toUpperCase() + singularKey.slice(1);
                    if (!knownTypes[elementTypeName]) {
                        knownTypes[elementTypeName] = analyzeDocument(firstElement, knownTypes);
                    }
                    // D�finir le type comme un tableau de ce type
                    structure[key] = `${elementTypeName}[]`;
                }
                else {
                    // Tableau de types primitifs
                    structure[key] = type;
                }
            }
            else {
                // Tableau vide ou non reconnu
                structure[key] = type;
            }
        }
        else {
            structure[key] = type;
        }
    });
    return structure;
}
// Fusionner plusieurs structures
function mergeStructures(structures) {
    const result = {};
    structures.forEach(structure => {
        Object.entries(structure).forEach(([key, type]) => {
            // Si la cl� existe d�j� mais avec un type diff�rent, utiliser any
            if (result[key] && result[key] !== type) {
                result[key] = 'any';
            }
            else {
                result[key] = type;
            }
        });
    });
    return result;
}
// Transformer la structure d'un DTO en structure de CritereDTO
function transformToCriteriaStructure(structure, knownTypes) {
    const criteriaStructure = {};
    // Copier tous les champs du DTO (par d�faut "contient" pour les cha�nes)
    Object.entries(structure).forEach(([key, type]) => {
        if (key === 'id')
            return; // D�j� inclus dans BaseCritereDTO
        criteriaStructure[key] = type;
    });
    return criteriaStructure;
}
// Calculer le chemin d'importation relatif
function calculateRelativeImportPath(fromDir, toDir, toFile) {
    const relativePath = path.relative(fromDir, toDir);
    return relativePath ? `${relativePath}/${toFile}` : `./${toFile}`;
}
// Fonction pour g�n�rer le contenu du fichier DTO avec imports g�n�riques
// Fonction pour g�n�rer le contenu du fichier DTO avec imports coh�rents
// Fonction pour g�n�rer le contenu du fichier DTO
function generateDTOContent(entityName, structure, knownTypes, entityDir) {
    const imports = new Set();
    imports.add(`import { BaseDTO } from "${config.baseImportPath}/BaseDTO";`);
    let properties = '';
    // Parcourir chaque propri�t� pour g�n�rer les imports et le contenu
    Object.entries(structure).forEach(([key, type]) => {
        if (key === 'id')
            return; // id est d�j� dans BaseDTO
        // Analyser le type pour d�terminer s'il s'agit d'un type primitif ou complexe
        let baseType = type;
        let isArray = false;
        if (type.endsWith('[]')) {
            baseType = type.substring(0, type.length - 2);
            isArray = true;
        }
        // Si c'est un type personnalis� (non primitif)
        if (!isPrimitiveType(baseType)) {
            // Importer le DTO correspondant
            const importPath = `../${baseType.toLowerCase()}/${baseType}DTO`;
            imports.add(`import { ${baseType}DTO } from "${importPath}";`);
            // Utiliser le type avec DTO dans la propri�t�
            if (isArray) {
                properties += `  ${key}?: ${baseType}DTO[];\n`;
            }
            else {
                properties += `  ${key}?: ${baseType}DTO;\n`;
            }
        }
        else {
            // Utiliser le type primitif tel quel
            properties += `  ${key}?: ${type};\n`;
        }
    });
    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * DTO pour l'entit� ${entityName}
 */
export class ${entityName}DTO extends BaseDTO {
${properties}}
`;
}
// Fonction pour g�n�rer le contenu du fichier CritereDTO
function generateCritereDTOContent(entityName, structure, entityDir) {
    const imports = new Set();
    imports.add(`import { BaseCritereDTO } from "${config.baseImportPath}/BaseCritereDTO";`);
    let properties = '';
    // Parcourir chaque propri�t� pour g�n�rer les imports et le contenu
    Object.entries(structure).forEach(([key, type]) => {
        if (key === 'id')
            return; // id est d�j� dans BaseCritereDTO
        // Analyser le type pour d�terminer s'il s'agit d'un type primitif ou complexe
        let baseType = type;
        let isArray = false;
        if (type.endsWith('[]')) {
            baseType = type.substring(0, type.length - 2);
            isArray = true;
        }
        // Si c'est un type personnalis� (non primitif)
        if (!isPrimitiveType(baseType)) {
            // Importer le DTO correspondant
            const importPath = `../${baseType.toLowerCase()}/${baseType}DTO`;
            imports.add(`import { ${baseType}DTO } from "${importPath}";`);
            // Utiliser le type avec DTO dans la propri�t�
            if (isArray) {
                properties += `  ${key}?: ${baseType}DTO[];\n`;
            }
            else {
                properties += `  ${key}?: ${baseType}DTO;\n`;
            }
        }
        else {
            // Utiliser le type primitif tel quel
            properties += `  ${key}?: ${type};\n`;
        }
    });
    // Construire le contenu du fichier
    const importStatements = Array.from(imports).join('\n');
    return `${importStatements}

/**
 * Crit�res de recherche pour l'entit� ${entityName}
 */
export abstract class ${entityName}CritereDTO extends BaseCritereDTO {
${properties}}
`;
}
// Fonction utilitaire pour v�rifier si un type est primitif
function isPrimitiveType(type) {
    const primitiveTypes = ['string', 'number', 'boolean', 'Date', 'any', 'object'];
    return primitiveTypes.some(pt => type === pt);
}
// Convertir un nom de collection en nom d'entit�
function collectionToEntityName(collectionName) {
    return collectionName
        .replace(/^[_]/, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('')
        .replace(/s$/, ''); // Enlever le 's' final si pr�sent
}
// Fonction pour d�terminer si une collection doit �tre exclue
function shouldExcludeCollection(collectionName) {
    return config.excludedDirectories.includes(collectionName.toLowerCase());
}
// Fonction principale pour g�n�rer les DTOs
function generateDTOs() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let client = null;
        try {
            console.log('D�marrage de la g�n�ration des DTOs...');
            // Nettoyer et cr�er les r�pertoires n�cessaires
            if (config.cleanOutputDir) {
                cleanDirectory(config.outputDir);
            }
            else {
                ensureDirectoryExists(config.outputDir);
            }
            ensureDirectoryExists(path.join(config.outputDir, 'base'));
            // G�n�rer les DTOs de base
            fs.writeFileSync(path.join(config.outputDir, 'base', 'BaseDTO.ts'), fs.readFileSync('./src/models/base/BaseDTO.ts'));
            fs.writeFileSync(path.join(config.outputDir, 'base', 'BaseCritereDTO.ts'), fs.readFileSync('./src/models/base/BaseCritereDTO.ts'));
            // Connexion � MongoDB
            client = new mongodb_1.MongoClient(config.mongoUri);
            yield client.connect();
            console.log('Connect� � MongoDB');
            const dbName = ((_a = config.mongoUri.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0]) || '';
            const db = client.db(dbName);
            // Cr�er manuellement des exemples si aucune collection n'est trouv�e
            const collections = yield db.listCollections().toArray();
            if (collections.length === 0) {
                console.log('Aucune collection trouv�e. Cr�ation d\'exemples de DTOs...');
                // Cr�er des DTOs d'exemple
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
                const knownTypes = {};
                for (const entity of exampleEntities) {
                    console.log(`G�n�ration des fichiers pour ${entity.name}...`);
                    // Cr�er le dossier pour l'entit�
                    const entityDir = path.join(config.outputDir, entity.name.toLowerCase());
                    ensureDirectoryExists(entityDir);
                    // G�n�rer la structure des crit�res
                    const criteriaStructure = transformToCriteriaStructure(entity.structure, knownTypes);
                    // G�n�rer et �crire le DTO
                    const dtoContent = generateDTOContent(entity.name, entity.structure, knownTypes, entityDir);
                    fs.writeFileSync(path.join(entityDir, `${entity.name}DTO.ts`), dtoContent);
                    // G�n�rer et �crire le CritereDTO
                    const critereDTOContent = generateCritereDTOContent(entity.name, criteriaStructure, entityDir);
                    fs.writeFileSync(path.join(entityDir, `${entity.name}CritereDTO.ts`), critereDTOContent);
                    console.log(`  Fichiers g�n�r�s pour ${entity.name}`);
                }
            }
            else {
                // Analyser les collections existantes
                console.log(`${collections.length} collections trouv�es.`);
                const knownTypes = {};
                const entityStructures = {};
                // Premi�re passe : analyser les documents de chaque collection
                for (const collection of collections) {
                    const collectionName = collection.name;
                    // V�rifier si la collection doit �tre exclue
                    if (shouldExcludeCollection(collectionName)) {
                        console.log(`Collection ${collectionName} exclue.`);
                        continue;
                    }
                    console.log(`Analyse de la collection ${collectionName}...`);
                    // Obtenir des �chantillons de documents
                    const documents = yield db.collection(collectionName)
                        .find()
                        .limit(config.sampleSize)
                        .toArray();
                    if (documents.length === 0) {
                        console.log(`  Aucun document trouv� dans ${collectionName}, ignor�.`);
                        continue;
                    }
                    // Analyser les structures de documents
                    const structures = documents.map(doc => analyzeDocument(doc, knownTypes));
                    const mergedStructure = mergeStructures(structures);
                    // Stocker la structure
                    const entityName = collectionToEntityName(collectionName);
                    entityStructures[entityName] = mergedStructure;
                }
                // Deuxi�me passe : g�n�rer les DTOs et CritereDTOs
                for (const [entityName, structure] of Object.entries(entityStructures)) {
                    // V�rifier si l'entit� figure dans la liste des exclusions
                    const entityLower = entityName.toLowerCase();
                    if (config.excludedDirectories.some(dir => dir.toLowerCase() === entityLower)) {
                        console.log(`Entit� ${entityName} exclue.`);
                        continue;
                    }
                    console.log(`G�n�ration des fichiers pour ${entityName}...`);
                    // Transformer la structure en crit�res
                    const criteriaStructure = transformToCriteriaStructure(structure, knownTypes);
                    // Cr�er le dossier pour l'entit�
                    const entityDir = path.join(config.outputDir, entityName.toLowerCase());
                    ensureDirectoryExists(entityDir);
                    // G�n�rer et �crire le DTO
                    const dtoContent = generateDTOContent(entityName, structure, knownTypes, entityDir);
                    fs.writeFileSync(path.join(entityDir, `${entityName}DTO.ts`), dtoContent);
                    // G�n�rer et �crire le CritereDTO
                    const critereDTOContent = generateCritereDTOContent(entityName, criteriaStructure, entityDir);
                    fs.writeFileSync(path.join(entityDir, `${entityName}CritereDTO.ts`), critereDTOContent);
                    console.log(`  Fichiers g�n�r�s pour ${entityName}`);
                }
                // Troisi�me passe : g�n�rer les DTOs et CritereDTOs pour les types complexes d�couverts
                for (const [typeName, structure] of Object.entries(knownTypes)) {
                    // V�rifier si le type figure dans la liste des exclusions
                    const typeLower = typeName.toLowerCase();
                    if (config.excludedDirectories.some(dir => dir.toLowerCase() === typeLower)) {
                        console.log(`Type complexe ${typeName} exclu.`);
                        continue;
                    }
                    console.log(`G�n�ration des fichiers pour le type complexe ${typeName}...`);
                    // Transformer la structure en crit�res
                    const criteriaStructure = transformToCriteriaStructure(structure, knownTypes);
                    // Cr�er le dossier pour le type
                    const typeDir = path.join(config.outputDir, typeName.toLowerCase());
                    ensureDirectoryExists(typeDir);
                    // G�n�rer et �crire le DTO
                    const dtoContent = generateDTOContent(typeName, structure, knownTypes, typeDir);
                    fs.writeFileSync(path.join(typeDir, `${typeName}DTO.ts`), dtoContent);
                    // G�n�rer et �crire le CritereDTO
                    const critereDTOContent = generateCritereDTOContent(typeName, criteriaStructure, typeDir);
                    fs.writeFileSync(path.join(typeDir, `${typeName}CritereDTO.ts`), critereDTOContent);
                    console.log(`  Fichiers g�n�r�s pour le type complexe ${typeName}`);
                }
            }
            console.log('G�n�ration des DTOs termin�e avec succ�s!');
        }
        catch (error) {
            console.error('Erreur lors de la g�n�ration des DTOs:', error);
        }
        finally {
            if (client) {
                yield client.close();
                console.log('D�connect� de MongoDB');
            }
        }
    });
}
// Ex�cuter la g�n�ration
generateDTOs();
//# sourceMappingURL=app.js.map
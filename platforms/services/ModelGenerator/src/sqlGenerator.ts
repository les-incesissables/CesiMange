import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
require('dotenv').config();

/**
 * Script de g�n�ration automatique de DTOs et Entit�s � partir de SQL Server
 * @author Mahmoud Charif - CESIMANGE-118 - 31/03/2025 - Cr�ation
 * @author Modifi� pour ajouter la g�n�ration d'entit�s, m�tiers et contr�leurs
 * @author Modifi� pour pr�server les fichiers modifi�s manuellement
 */

// Configuration des services et des tables associ�es
const serviceConfigs = [
    {
        serviceName: 'auth-service',
        tables: ['T_AUTH_USERS', 'T_TRANSACTIONS'],
        outputDir: '../../microservices/auth-service/src/models/',
        metierDir: '../../microservices/auth-service/src/metier/',
        controllerDir: '../../microservices/auth-service/src/controllers/',
    },
];

// Configuration g�n�rale
const config = {
    excludedFields: ['CreatedAt', 'UpdatedAt', 'DeletedAt'],
    excludedTables: ['__EFMigrationsHistory', 'sysdiagrams'],
    cleanOutputDir: false,
    protectedFolders: ['base'],
    generatorSignature: '\\* @author (Entity|DTO|Metier|Controller) Generator',
    overwriteExistingFiles: false,
};

// Types et interfaces pour l'analyse
interface ColumnInfo {
    name: string;
    dataType: string;
    isNullable: boolean;
    maxLength: number | null;
    defaultValue: string | null;
    isPrimaryKey: boolean;
}

interface TableSchema {
    columns: ColumnInfo[];
    primaryKeys: string[];
}

// Fonction pour s'assurer qu'un r�pertoire existe
function ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Fonction pour nettoyer un r�pertoire tout en pr�servant certains dossiers
function cleanDirectory(dirPath: string, protectedFolders: string[] = []): void {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();

        if (isDirectory) {
            if (!protectedFolders.includes(item)) {
                fs.rmSync(itemPath, { recursive: true, force: true });
            }
        } else {
            fs.unlinkSync(itemPath);
        }
    }
}

// Fonction pour v�rifier si un fichier a �t� modifi� manuellement
function isFileModifiedManually(filePath: string): boolean {
    if (!fs.existsSync(filePath)) return false;

    const fileContent = fs.readFileSync(filePath, 'utf8');

    // V�rifier si le contenu contient la signature du g�n�rateur
    const generatorRegex = /\* @author (Entity|DTO|Metier|Controller) Generator/;
    const hasGeneratorSignature = generatorRegex.test(fileContent);

    // Si le fichier contient notre signature mais a �t� modifi� apr�s sa g�n�ration initiale
    if (hasGeneratorSignature) {
        const creationDateMatch = fileContent.match(/@author (?:Entity|DTO|Metier|Controller) Generator - ([0-9TZ:.+-]+) - Creation/);
        if (creationDateMatch && creationDateMatch[1]) {
            const creationDate = new Date(creationDateMatch[1]);
            const modificationDate = fs.statSync(filePath).mtime;

            // Si le fichier a �t� modifi� apr�s sa g�n�ration initiale d'au moins 5 minutes
            // (pour �viter les faux positifs li�s au d�lai entre g�n�ration et �criture sur disque)
            const fiveMinutes = 5 * 60 * 1000;
            return modificationDate.getTime() > creationDate.getTime() + fiveMinutes;
        }
    }

    // Si pas de signature ou format inattendu, consid�rer comme modifi� manuellement
    return true;
}

// Fonction pour �crire un fichier en v�rifiant s'il a �t� modifi� manuellement
function writeFileIfNotModified(filePath: string, content: string): boolean {
    if (!config.overwriteExistingFiles && fs.existsSync(filePath)) {
        if (isFileModifiedManually(filePath)) {
            console.log(`  Fichier pr�serv� (modifi� manuellement): ${filePath}`);
            return false;
        }
    }

    fs.writeFileSync(filePath, content);
    return true;
}

// Fonction pour convertir le nom d'une table en nom de classe (PascalCase)
function tableNameToClassName(name: string): string {
    // Enlever le pr�fixe T_ si pr�sent
    const nameWithoutPrefix = name.startsWith('T_') ? name.substring(2) : name;

    // Enlever le "s" final pour les pluriels si applicable
    const singularName = nameWithoutPrefix.endsWith('s') ? nameWithoutPrefix.slice(0, -1) : nameWithoutPrefix;

    // Convertir en PascalCase
    return singularName
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

// Fonction pour convertir un nom de colonne en camelCase
function columnNameToCamelCase(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1);
}

// Fonction pour convertir un type SQL en type TypeScript
function sqlTypeToTypeScript(sqlType: string, isNullable: boolean): string {
    const typeMap: Record<string, string> = {
        int: 'number',
        bigint: 'number',
        smallint: 'number',
        tinyint: 'number',
        bit: 'boolean',
        decimal: 'number',
        numeric: 'number',
        money: 'number',
        float: 'number',
        datetime: 'Date',
        date: 'Date',
        char: 'string',
        varchar: 'string',
        text: 'string',
        nchar: 'string',
        nvarchar: 'string',
        uniqueidentifier: 'string',
    };

    const tsType = typeMap[sqlType.toLowerCase()] || 'any';
    return tsType;
}

// Fonction pour analyser la structure d'une table
async function analyzeTable(tableName: string, dataSource: DataSource): Promise<TableSchema> {
    try {
        // R�cup�rer les colonnes de la table
        const columns = await dataSource.query(`
            SELECT 
                c.COLUMN_NAME as name,
                c.DATA_TYPE as dataType,
                CASE WHEN c.IS_NULLABLE = 'YES' THEN 1 ELSE 0 END as isNullable,
                c.CHARACTER_MAXIMUM_LENGTH as maxLength,
                c.COLUMN_DEFAULT as defaultValue,
                CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END as isPrimaryKey
            FROM 
                INFORMATION_SCHEMA.COLUMNS c
            LEFT JOIN 
                (
                    SELECT ku.COLUMN_NAME
                    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
                    ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
                    WHERE tc.TABLE_NAME = '${tableName}' AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
                ) pk
            ON c.COLUMN_NAME = pk.COLUMN_NAME
            WHERE 
                c.TABLE_NAME = '${tableName}'
            ORDER BY 
                c.ORDINAL_POSITION
        `);

        if (!columns || columns.length === 0) {
            console.log(`  La table ${tableName} n'existe pas ou est vide.`);
            return { columns: [], primaryKeys: [] };
        }

        const primaryKeys = columns.filter((col: ColumnInfo) => col.isPrimaryKey).map((col: ColumnInfo) => col.name);

        return {
            columns,
            primaryKeys,
        };
    } catch (error) {
        console.error(`Erreur lors de l'analyse de la table ${tableName}:`, error);
        throw error;
    }
}

// Fonction pour g�n�rer une entit� TypeORM
function generateEntityContent(className: string, tableName: string, schema: TableSchema): string {
    let content = `import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";\n\n`;
    content += `/**\n`;
    content += ` * Entit� TypeORM pour la table SQL Server ${tableName}\n`;
    content += ` * @author Entity Generator - ${new Date().toISOString()} - Creation\n`;
    content += ` */\n`;
    content += `@Entity("${tableName}")\n`;
    content += `export class ${className} implements ObjectLiteral\n{\n`;

    // Ajouter les propri�t�s avec d�corateurs TypeORM
    schema.columns.forEach((column) => {
        if (!config.excludedFields.includes(column.name)) {
            const camelCaseName = columnNameToCamelCase(column.name);

            content += `    /**\n`;
            content += `     * ${camelCaseName}\n`;
            if (column.maxLength) content += `     * @maxLength ${column.maxLength}\n`;
            content += `     */\n`;

            // G�n�rer le d�corateur TypeORM appropri�
            if (column.isPrimaryKey) {
                if (column.name.toLowerCase().includes('id') && column.dataType.toLowerCase().includes('int')) {
                    content += `    @PrimaryGeneratedColumn()\n`;
                } else {
                    content += `    @PrimaryColumn()\n`;
                }
            } else {
                content += `    @Column(`;

                // Options pour le d�corateur Column
                const options = [];
                if (column.dataType.toLowerCase().includes('char') && column.maxLength) {
                    options.push(`length: ${column.maxLength}`);
                }
                if (!column.isNullable) {
                    options.push(`nullable: false`);
                }

                if (options.length > 0) {
                    content += `{ ${options.join(', ')} }`;
                }

                content += `)\n`;
            }

            // G�n�rer la propri�t� avec | undefined
            content += `    ${camelCaseName}?: ${sqlTypeToTypeScript(column.dataType, column.isNullable)};\n\n`;
        }
    });

    content += `}\n`;
    return content;
}

// Fonction pour g�n�rer le contenu du fichier CritereDTO
function generateCritereDTOContent(className: string, schema: TableSchema): string {
    let content = `import { ObjectLiteral } from "typeorm";\n`;
    content += `import { BaseCritereDTO } from "../../../../../../services/data-access-layer/src/models/base/BaseCritereDTO";\n\n`;
    content += `/**\n`;
    content += ` * CritereDTO pour la recherche d'entit�s SQL Server ${className}\n`;
    content += ` * @author DTO Generator - ${new Date().toISOString()} - Creation\n`;
    content += ` */\n`;
    content += `export class ${className}CritereDTO extends BaseCritereDTO implements ObjectLiteral\n{\n`;

    // Ajouter les propri�t�s pour la recherche
    schema.columns.forEach((column) => {
        if (!config.excludedFields.includes(column.name)) {
            const tsType = sqlTypeToTypeScript(column.dataType, true);
            const camelCaseName = columnNameToCamelCase(column.name);

            content += `    /**\n`;
            content += `     * Crit�re de recherche pour ${camelCaseName}\n`;
            content += `     */\n`;
            content += `    ${camelCaseName}?: ${tsType} | undefined;\n\n`;

            // Pour les cha�nes, ajouter une recherche par Like
            if (column.dataType.toLowerCase().includes('char') || column.dataType.toLowerCase() === 'text') {
                content += `    /**\n`;
                content += `     * Recherche avec LIKE pour ${camelCaseName}\n`;
                content += `     */\n`;
                content += `    ${camelCaseName}Like?: string | undefined;\n\n`;
            }

            // Pour les nombres et dates, ajouter des plages
            if (
                (['int', 'bigint', 'smallint', 'tinyint', 'decimal', 'numeric', 'money', 'float', 'real'].includes(column.dataType.toLowerCase()) ||
                    column.dataType.toLowerCase().includes('date')) &&
                !column.name.toLowerCase().includes('id')
            ) {
                content += `    /**\n`;
                content += `     * Valeur minimale pour ${camelCaseName}\n`;
                content += `     */\n`;
                content += `    ${camelCaseName}Min?: ${tsType} | undefined;\n\n`;

                content += `    /**\n`;
                content += `     * Valeur maximale pour ${camelCaseName}\n`;
                content += `     */\n`;
                content += `    ${camelCaseName}Max?: ${tsType} | undefined;\n\n`;
            }
        }
    });

    content += `}\n`;
    return content;
}

// Fonction pour g�n�rer le contenu du fichier m�tier
function generateMetierContent(className: string, schema: TableSchema): string {
    let content = `import { ${className} } from "../../models/entities/${className.toLowerCase()}/${className}";\n`;
    content += `import { ${className}CritereDTO } from "../../models/entities/${className.toLowerCase()}/${className}CritereDTO";\n`;
    content += `import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";\n\n`;
    content += `/**\n`;
    content += ` * M�tier pour l'entit� ${className}\n`;
    content += ` * @author Metier Generator - ${new Date().toISOString()} - Creation\n`;
    content += ` */\n`;
    content += `export class ${className}Metier extends BaseMetier<${className}, ${className}CritereDTO> {\n`;
    content += `    constructor() {\n`;
    content += `        super('${className}', ${className});\n`;
    content += `    }\n`;
    content += `}\n`;
    return content;
}

// Fonction pour g�n�rer le contenu du fichier contr�leur
function generateControllerContent(className: string, schema: TableSchema): string {
    let content = `import { ${className} } from "../../models/entities/${className.toLowerCase()}/${className}";\n`;
    content += `import { ${className}CritereDTO } from "../../models/entities/${className.toLowerCase()}/${className}CritereDTO";\n`;
    content += `import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";\n\n`;
    content += `/**\n`;
    content += ` * Contr�leur pour l'entit� ${className}\n`;
    content += ` * @author Controller Generator - ${new Date().toISOString()} - Creation\n`;
    content += ` */\n`;
    content += `export class ${className}Controller extends BaseController<${className}, ${className}CritereDTO> {\n\n`;
    content += `    override initializeRoutes(): void {\n`;
    content += `        this.Router.get('/', );\n`;
    content += `    }\n\n`;
    content += `}\n`;
    return content;
}

// Fonction principale pour g�n�rer les DTOs, entit�s, m�tiers et contr�leurs
async function generateDTOs(): Promise<void> {
    let dataSource: DataSource | null = null;

    try {
        console.log('D�marrage de la g�n�ration des DTOs, Entit�s, M�tiers et Contr�leurs pour SQL Server...');

        // Connexion � SQL Server avec TypeORM
        dataSource = new DataSource({
            type: 'mssql',
            host: process.env.DB_SERVER || 'mssql-auth',
            port: parseInt(process.env.DB_PORT || '1433'),
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
            },
            extra: {
                trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
                connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
            },
        });

        await dataSource.initialize();
        console.log('Connexion SQL Server �tablie');

        // R�cup�rer toutes les tables disponibles
        const tables = await dataSource.query(`
            SELECT TABLE_NAME as name
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);

        const allTables = tables.map((t: { name: string }) => t.name).filter((name: string) => !config.excludedTables.includes(name));

        console.log(`${allTables.length} tables trouv�es apr�s filtrage initial.`);

        // Pour chaque service configur�
        for (const serviceConfig of serviceConfigs) {
            if (serviceConfig.tables.length === 0) {
                console.log(`\nAucune table configur�e pour le service: ${serviceConfig.serviceName}, ignor�.`);
                continue;
            }

            console.log(`\nTraitement du service: ${serviceConfig.serviceName}`);

            // Nettoyer les dossiers si n�cessaire et cr�er la structure
            const { outputDir, metierDir, controllerDir } = serviceConfig;

            if (config.cleanOutputDir) {
                if (fs.existsSync(outputDir)) {
                    cleanDirectory(outputDir, config.protectedFolders);
                }
                if (fs.existsSync(metierDir)) {
                    cleanDirectory(metierDir, config.protectedFolders);
                }
                if (fs.existsSync(controllerDir)) {
                    cleanDirectory(controllerDir, config.protectedFolders);
                }
            }

            // Cr�er les r�pertoires principaux
            ensureDirectoryExists(outputDir);
            ensureDirectoryExists(metierDir);
            ensureDirectoryExists(controllerDir);

            // Cr�er un dossier entities pour les DTOs et crit�res
            const entitiesDir = path.join(outputDir, 'entities');
            ensureDirectoryExists(entitiesDir);

            // Cr�er les dossiers base pour les classes de base
            ensureDirectoryExists(path.join(metierDir, 'base'));
            ensureDirectoryExists(path.join(controllerDir, 'base'));

            // Filtrer les tables pour ce service
            const serviceTables = allTables.filter((name: string) => serviceConfig.tables.includes(name));

            console.log(`${serviceTables.length} tables associ�es � ce service.`);

            // Traiter chaque table pour ce service
            for (const tableName of serviceTables) {
                console.log(`Analyse de la table: ${tableName}`);

                const schema = await analyzeTable(tableName, dataSource);

                if (schema.columns.length > 0) {
                    const className = tableNameToClassName(tableName);

                    // === 1. Cr�ation des fichiers Entity et CritereDTO ===
                    // Cr�er un sous-dossier pour chaque mod�le dans entities
                    const modelDir = path.join(entitiesDir, className.toLowerCase());
                    ensureDirectoryExists(modelDir);

                    // G�n�rer le fichier Entity
                    const entityContent = generateEntityContent(className, tableName, schema);
                    const entityFilePath = path.join(modelDir, `${className}.ts`);
                    if (writeFileIfNotModified(entityFilePath, entityContent)) {
                        console.log(`  Entity g�n�r�: ${entityFilePath}`);
                    }

                    // G�n�rer le fichier CritereDTO
                    const critereDtoContent = generateCritereDTOContent(className, schema);
                    const critereDtoFilePath = path.join(modelDir, `${className}CritereDTO.ts`);
                    if (writeFileIfNotModified(critereDtoFilePath, critereDtoContent)) {
                        console.log(`  CritereDTO g�n�r�: ${critereDtoFilePath}`);
                    }

                    // === 2. Cr�ation des fichiers Metier ===
                    const metierClassDir = path.join(metierDir, className.toLowerCase());
                    ensureDirectoryExists(metierClassDir);

                    const metierContent = generateMetierContent(className, schema);
                    const metierFilePath = path.join(metierClassDir, `${className}Metier.ts`);
                    if (writeFileIfNotModified(metierFilePath, metierContent)) {
                        console.log(`  Metier g�n�r�: ${metierFilePath}`);
                    }

                    // === 3. Cr�ation des fichiers Controller ===
                    const controllerClassDir = path.join(controllerDir, className.toLowerCase());
                    ensureDirectoryExists(controllerClassDir);

                    const controllerContent = generateControllerContent(className, schema);
                    const controllerFilePath = path.join(controllerClassDir, `${className}Controller.ts`);
                    if (writeFileIfNotModified(controllerFilePath, controllerContent)) {
                        console.log(`  Controller g�n�r�: ${controllerFilePath}`);
                    }
                } else {
                    console.log(`  Aucun fichier g�n�r� pour ${tableName} (table vide ou structure non d�tect�e).`);
                }
            }
        }

        console.log('\nG�n�ration des DTOs, Entit�s, M�tiers et Contr�leurs termin�e avec succ�s pour tous les services!');
    } catch (error) {
        console.error('Erreur lors de la g�n�ration des fichiers:', error);
    } finally {
        // Fermer la connexion DataSource
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('D�connect� de SQL Server');
        }
    }
}

// Ex�cuter la g�n�ration
generateDTOs();

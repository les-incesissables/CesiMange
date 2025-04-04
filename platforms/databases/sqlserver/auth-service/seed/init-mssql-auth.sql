-- init-mssql-auth.sql
-- Ce script initialise la base de données Auth (par exemple, "CesiMangeAuth")

-- Optionnel : créer la base si elle n'existe pas déjà (exécuté depuis un outil externe)
-- CREATE DATABASE CesiMangeAuth;
-- USE CesiMangeAuth;

-- Création de la table T_AUTH_USERS
IF OBJECT_ID('CesiMangeAuth.dbo.T_AUTH_USERS', 'U') IS NOT NULL
    DROP TABLE CesiMangeAuth.dbo.T_AUTH_USERS;

CREATE TABLE CesiMangeAuth.dbo.T_AUTH_USERS (
    auth_user_id int IDENTITY(1,1) NOT NULL,
    email nvarchar(255) NOT NULL,
    phone_number nvarchar(20) NULL,
    password_hash nvarchar(255) NOT NULL,
    [role] nvarchar(20) NOT NULL,
    email_verified bit DEFAULT 0 NULL,
    phone_verified bit DEFAULT 0 NULL,
    last_login datetime NULL,
    refresh_token nvarchar(255) NULL,
    active bit DEFAULT 1 NULL,
    created_at datetime DEFAULT getdate() NOT NULL,
    updated_at datetime DEFAULT getdate() NOT NULL,
    username nvarchar(50) NULL,
    CONSTRAINT PK_T_AUTH_USERS PRIMARY KEY (auth_user_id),
    CONSTRAINT UQ_T_AUTH_USERS_phone UNIQUE (phone_number),
    CONSTRAINT UQ_T_AUTH_USERS_email UNIQUE (email)
);

CREATE NONCLUSTERED INDEX IDX_auth_users_email
    ON CesiMangeAuth.dbo.T_AUTH_USERS (email ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

CREATE NONCLUSTERED INDEX IDX_auth_users_phone
    ON CesiMangeAuth.dbo.T_AUTH_USERS (phone_number ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

ALTER TABLE CesiMangeAuth.dbo.T_AUTH_USERS 
    WITH NOCHECK ADD CONSTRAINT CK_T_AUTH_USERS_role 
    CHECK (([role]='admin' OR [role]='driver' OR [role]='restaurant' OR [role]='client'));

----------------------------------------------------------------
-- Création de la table T_TRANSACTIONS
----------------------------------------------------------------
IF OBJECT_ID('CesiMangeAuth.dbo.T_TRANSACTIONS', 'U') IS NOT NULL
    DROP TABLE CesiMangeAuth.dbo.T_TRANSACTIONS;

CREATE TABLE CesiMangeAuth.dbo.T_TRANSACTIONS (
    transactions_id int IDENTITY(1,1) NOT NULL,
    order_id nvarchar(50) NOT NULL,  -- Référence logique vers Order Service
    payment_intent_id nvarchar(100) NULL,
    amount decimal(10,2) NOT NULL,
    currency nvarchar(3) DEFAULT 'EUR' NOT NULL,
    status nvarchar(20) NOT NULL,
    payment_method nvarchar(30) NOT NULL,
    payment_provider nvarchar(30) NOT NULL,
    created_at datetime DEFAULT getdate() NOT NULL,
    updated_at datetime DEFAULT getdate() NOT NULL,
    CONSTRAINT PK_T_TRANSACTIONS PRIMARY KEY (transactions_id)
);

CREATE NONCLUSTERED INDEX IDX_transactions_created_at
    ON CesiMangeAuth.dbo.T_TRANSACTIONS (created_at ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

CREATE NONCLUSTERED INDEX IDX_transactions_order_id
    ON CesiMangeAuth.dbo.T_TRANSACTIONS (order_id ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

CREATE NONCLUSTERED INDEX IDX_transactions_status
    ON CesiMangeAuth.dbo.T_TRANSACTIONS (status ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

----------------------------------------------------------------
-- Création de la table T_AUDIT_LOGS
----------------------------------------------------------------
IF OBJECT_ID('CesiMangeAuth.dbo.T_AUDIT_LOGS', 'U') IS NOT NULL
    DROP TABLE CesiMangeAuth.dbo.T_AUDIT_LOGS;

CREATE TABLE CesiMangeAuth.dbo.T_AUDIT_LOGS (
    audit_logs_id int IDENTITY(1,1) NOT NULL,
    user_id int NULL,
    [action] nvarchar(50) NOT NULL,
    entity_type nvarchar(50) NOT NULL,
    entity_id nvarchar(50) NOT NULL,
    ip_address nvarchar(45) NULL,
    user_agent nvarchar(500) NULL,
    changes nvarchar(500) NULL,
    timestamp datetime DEFAULT getdate() NOT NULL,
    CONSTRAINT PK_T_AUDIT_LOGS PRIMARY KEY (audit_logs_id),
    CONSTRAINT FK_T_AUDIT_LOGS_user FOREIGN KEY (user_id)
      REFERENCES CesiMangeAuth.dbo.T_AUTH_USERS(auth_user_id)
);

CREATE NONCLUSTERED INDEX IDX_audit_logs_entity
    ON CesiMangeAuth.dbo.T_AUDIT_LOGS (entity_type ASC, entity_id ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

CREATE NONCLUSTERED INDEX IDX_audit_logs_timestamp
    ON CesiMangeAuth.dbo.T_AUDIT_LOGS (timestamp ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

CREATE NONCLUSTERED INDEX IDX_audit_logs_user_id
    ON CesiMangeAuth.dbo.T_AUDIT_LOGS (user_id ASC)
     WITH (PAD_INDEX = OFF, FILLFACTOR = 100, SORT_IN_TEMPDB = OFF, 
           IGNORE_DUP_KEY = OFF, STATISTICS_NORECOMPUTE = OFF, ONLINE = OFF, 
           ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
     ON [PRIMARY];

PRINT '🎉 All Auth Service tables, indexes, and constraints have been created successfully.';

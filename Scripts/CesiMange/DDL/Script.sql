-- Création de la base de données (si elle n'existe pas déjà)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CesiMange')
BEGIN
    CREATE DATABASE CesiMange;
END
GO

USE CesiMange;
GO

-- Table des utilisateurs authentifiés
CREATE TABLE T_AUTH_USERS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'restaurant', 'driver', 'admin')),
    email_verified BIT DEFAULT 0,
    phone_verified BIT DEFAULT 0,
    last_login DATETIME,
    refresh_token VARCHAR(255),
    active BIT DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Table des transactions de paiement
CREATE TABLE T_TRANSACTIONS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL, -- ID de MonDB
    payment_intent_id VARCHAR(100), -- ID du processeur de paiement (ex: Stripe)
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR', 
    status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_provider VARCHAR(30) NOT NULL, -- Stripe, PayPal, etc.
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);
GO

-- Table d'audit pour tracer les activités
CREATE TABLE T_AUDIT_LOGS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- Nom de la table/collection modifiée
    entity_id VARCHAR(50) NOT NULL, -- ID de l'objet modifié
    ip_address VARCHAR(45), -- Peut stocker IPv4 et IPv6
    user_agent VARCHAR(500), -- Navigateur/app utilisé
    changes NVARCHAR(MAX), -- Stocke le JSON des changements
    timestamp DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES T_AUTH_USERS(id)
);
GO

-- Index pour améliorer les performances
CREATE INDEX IDX_auth_users_email ON T_AUTH_USERS(email);
GO
CREATE INDEX IDX_auth_users_phone ON T_AUTH_USERS(phone_number);
GO
CREATE INDEX IDX_transactions_order_id ON T_TRANSACTIONS(order_id);
GO
CREATE INDEX IDX_transactions_status ON T_TRANSACTIONS(status);
GO
CREATE INDEX IDX_transactions_created_at ON T_TRANSACTIONS(created_at);
GO
CREATE INDEX IDX_audit_logs_user_id ON T_AUDIT_LOGS(user_id);
GO
CREATE INDEX IDX_audit_logs_entity ON T_AUDIT_LOGS(entity_type, entity_id);
GO
CREATE INDEX IDX_audit_logs_timestamp ON T_AUDIT_LOGS(timestamp);
GO

-- Procédure stockée pour l'audit automatique
CREATE PROCEDURE PS_ADD_AUDIT_LOG
    @user_id INT,
    @action VARCHAR(50),
    @entity_type VARCHAR(50),
    @entity_id VARCHAR(50),
    @ip_address VARCHAR(45),
    @user_agent VARCHAR(500),
    @changes NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO T_AUDIT_LOGS (user_id, action, entity_type, entity_id, ip_address, user_agent, changes)
    VALUES (@user_id, @action, @entity_type, @entity_id, @ip_address, @user_agent, @changes);
END;
GO

-- Trigger pour mettre à jour le champ updated_at sur les modifications
CREATE TRIGGER TRG_AUTH_USERS_UPDATE
ON T_AUTH_USERS
AFTER UPDATE
AS
BEGIN
    UPDATE T_AUTH_USERS
    SET updated_at = GETDATE()
    FROM T_AUTH_USERS u
    INNER JOIN inserted i ON u.id = i.id;
END;
GO

CREATE TRIGGER TRG_TRANSACTIONS_UPDATE
ON T_TRANSACTIONS
AFTER UPDATE
AS
BEGIN
    UPDATE T_TRANSACTIONS
    SET updated_at = GETDATE()
    FROM T_TRANSACTIONS t
    INNER JOIN inserted i ON t.id = i.id;
END;
GO

-- Procédure stockée pour créer un nouvel utilisateur
CREATE PROCEDURE PS_CREATE_USER
    @email VARCHAR(255),
    @phone_number VARCHAR(20),
    @password_hash VARCHAR(255),
    @role VARCHAR(20),
    @user_id INT OUTPUT
AS
BEGIN
    INSERT INTO T_AUTH_USERS (email, phone_number, password_hash, role, created_at, updated_at)
    VALUES (@email, @phone_number, @password_hash, @role, GETDATE(), GETDATE());
    
    SET @user_id = SCOPE_IDENTITY();
END;
GO

-- Procédure stockée pour l'authentification
CREATE PROCEDURE PS_AUTHENTICATE_USER
    @email VARCHAR(255),
    @success BIT OUTPUT,
    @user_id INT OUTPUT,
    @role VARCHAR(20) OUTPUT
AS
BEGIN
    SELECT @user_id = id, @role = role, @success = 1
    FROM T_AUTH_USERS
    WHERE email = @email AND active = 1;
    
    IF @user_id IS NULL
    BEGIN
        SET @success = 0;
        SET @role = NULL;
    END
    ELSE
    BEGIN
        UPDATE T_AUTH_USERS
        SET last_login = GETDATE()
        WHERE id = @user_id;
    END
END;
GO

-- Procédure stockée pour enregistrer une transaction
CREATE PROCEDURE PS_RECORD_TRANSACTION
    @order_id VARCHAR(50),
    @payment_intent_id VARCHAR(100),
    @amount DECIMAL(10, 2),
    @currency VARCHAR(3),
    @status VARCHAR(20),
    @payment_method VARCHAR(30),
    @payment_provider VARCHAR(30),
    @transaction_id INT OUTPUT
AS
BEGIN
    INSERT INTO T_TRANSACTIONS (order_id, payment_intent_id, amount, currency, status, 
                              payment_method, payment_provider, created_at, updated_at)
    VALUES (@order_id, @payment_intent_id, @amount, @currency, @status, 
            @payment_method, @payment_provider, GETDATE(), GETDATE());
    
    SET @transaction_id = SCOPE_IDENTITY();
END;
GO
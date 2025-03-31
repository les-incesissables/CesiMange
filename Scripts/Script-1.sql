
-- Tables d'authentification et utilisateurs
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    CreatedAt DATETIME DEFAULT GETDATE(),
    LastLogin DATETIME,
    Status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE UserRoles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE UserToRoles (
    UserId INT,
    RoleId INT,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
);

CREATE TABLE Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT UNIQUE,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Restaurants (
    RestaurantId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT UNIQUE,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Address VARCHAR(255),
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    OpeningHours VARCHAR(255),
    Rating DECIMAL(3,2),
    Status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Drivers (
    DriverId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT UNIQUE,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    VehicleType VARCHAR(50),
    LicensePlate VARCHAR(20),
    CurrentStatus VARCHAR(20) DEFAULT 'OFFLINE',
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Tables des menus et produits
CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Description TEXT
);

CREATE TABLE MenuItems (
    MenuItemId INT IDENTITY(1,1) PRIMARY KEY,
    RestaurantId INT,
    CategoryId INT,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10,2) NOT NULL,
    Image VARCHAR(255),
    IsAvailable BIT DEFAULT 1,
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(RestaurantId),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
);

CREATE TABLE MenuItemOptions (
    OptionId INT IDENTITY(1,1) PRIMARY KEY,
    MenuItemId INT,
    Name VARCHAR(50) NOT NULL,
    PriceExtra DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(MenuItemId)
);

-- Tables des adresses
CREATE TABLE Addresses (
    AddressId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT,
    AddressLine1 VARCHAR(255) NOT NULL,
    AddressLine2 VARCHAR(255),
    City VARCHAR(100) NOT NULL,
    PostalCode VARCHAR(20) NOT NULL,
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    IsDefault BIT DEFAULT 0,
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId)
);

-- Tables des commandes et paiements
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT,
    RestaurantId INT,
    DriverId INT,
    AddressId INT,
    OrderStatus VARCHAR(50) DEFAULT 'PENDING',
    OrderDate DATETIME DEFAULT GETDATE(),
    EstimatedDeliveryTime DATETIME,
    ActualDeliveryTime DATETIME,
    SubTotal DECIMAL(10,2),
    DeliveryFee DECIMAL(10,2),
    Tax DECIMAL(10,2),
    TotalAmount DECIMAL(10,2),
    SpecialInstructions TEXT,
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(RestaurantId),
    FOREIGN KEY (DriverId) REFERENCES Drivers(DriverId),
    FOREIGN KEY (AddressId) REFERENCES Addresses(AddressId)
);

CREATE TABLE OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT,
    MenuItemId INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL,
    SpecialInstructions TEXT,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (MenuItemId) REFERENCES MenuItems(MenuItemId)
);

CREATE TABLE OrderItemOptions (
    OrderItemId INT,
    OptionId INT,
    PRIMARY KEY (OrderItemId, OptionId),
    FOREIGN KEY (OrderItemId) REFERENCES OrderItems(OrderItemId),
    FOREIGN KEY (OptionId) REFERENCES MenuItemOptions(OptionId)
);

CREATE TABLE Payments (
    PaymentId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT UNIQUE,
    PaymentMethod VARCHAR(50) NOT NULL,
    PaymentStatus VARCHAR(50) DEFAULT 'PENDING',
    TransactionId VARCHAR(100),
    Amount DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

-- Tables pour les évaluations
CREATE TABLE Reviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT,
    CustomerId INT,
    RestaurantId INT,
    DriverId INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    ReviewDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (CustomerId) REFERENCES Customers(CustomerId),
    FOREIGN KEY (RestaurantId) REFERENCES Restaurants(RestaurantId),
    FOREIGN KEY (DriverId) REFERENCES Drivers(DriverId)
);

-- Tables pour les promotions
CREATE TABLE Promotions (
    PromotionId INT IDENTITY(1,1) PRIMARY KEY,
    Code VARCHAR(50) UNIQUE,
    Description TEXT,
    DiscountType VARCHAR(20),
    DiscountValue DECIMAL(10,2),
    MinimumOrderAmount DECIMAL(10,2),
    StartDate DATETIME,
    EndDate DATETIME,
    IsActive BIT DEFAULT 1
);
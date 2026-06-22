CREATE DATABASE IF NOT EXISTS jurassicpark2;
USE jurassicpark2;

CREATE TABLE IF NOT EXISTS `user`(
	id INT NOT NULL AUTO_INCREMENT,
    
    name VARCHAR(60) NOT NULL,
	email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS park(
	idUser INT NOT NULL UNIQUE,
    
    name VARCHAR(120) NOT NULL,
    rating FLOAT NOT NULL DEFAULT 0,
    balance INT NOT NULL DEFAULT 0,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP(),
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    
    PRIMARY KEY(idUser),
    CONSTRAINT fkParkUser FOREIGN KEY (idUser) REFERENCES `user`(id) ON DELETE CASCADE,
    
    CONSTRAINT chkParkRating CHECK(rating BETWEEN 0 AND 5),
    CONSTRAINT chkParkBalance CHECK(balance BETWEEN 0 AND 999999)
);

CREATE TABLE IF NOT EXISTS building(
	id INT NOT NULL AUTO_INCREMENT,
    idUpgrade INT NULL UNIQUE,
    
    name VARCHAR(45) NOT NULL UNIQUE,
    category VARCHAR(45) NOT NULL,
    durability INT NOT NULL DEFAULT 0,
    baseCost INT NOT NULL DEFAULT 0,
    upgradeCost INT NULL,
    placeable TINYINT NOT NULL DEFAULT 1,
    
    PRIMARY KEY (id),
    CONSTRAINT fkBuildingBuilding FOREIGN KEY (idUpgrade) REFERENCES building(id),
	
    CONSTRAINT chkBuildingCategory CHECK(category IN('terrain', 'path', 'enclosure', 'building')),
	CONSTRAINT chkBuildingDurability CHECK(durability >= 0),
    CONSTRAINT chkBuildingBaseCost CHECK(baseCost >= 0),
    CONSTRAINT chkBuildingUpgradeCost CHECK(upgradeCost >= 0)
);

CREATE TABLE IF NOT EXISTS species(
	id INT NOT NULL AUTO_INCREMENT,
    
    name VARCHAR(45) NOT NULL,
    temporalRange VARCHAR(45) NOT NULL,
    locomotionType VARCHAR(45) NOT NULL,
    heightInMeters DECIMAL(10, 3) NOT NULL,
    weightInKilograms DECIMAL(10, 3) NOT NULL,
    diet VARCHAR(45) NOT NULL,
    aggressiveness FLOAT NOT NULL,
    ratingWeight FLOAT NOT NULL,
    hatchCost INT NOT NULL DEFAULT 0,
    hatchSuccessRate FLOAT NOT NULL DEFAULT 1,
    
    PRIMARY KEY (id),

	CONSTRAINT chkSpeciesDiet CHECK(diet IN('herbívoro', 'carnívoro', 'onívoro')),
    CONSTRAINT chkSpeciesHeight CHECK(heightInMeters > 0),
    CONSTRAINT chkSpeciesWeight CHECK(weightInKilograms > 0),
    CONSTRAINT chkSpeciesAggressiveness CHECK(aggressiveness BETWEEN 0 AND 1),
    CONSTRAINT chkSpeciesRatingWeight CHECK(ratingWeight BETWEEN 0 AND 5),
    CONSTRAINT chkSpeciesHatchCost CHECK(hatchCost >= 0),
    CONSTRAINT chkSpecieshatchSuccessRate CHECK(hatchSuccessRate BETWEEN 0 AND 1)
);

CREATE TABLE IF NOT EXISTS tile(
	idPark INT NOT NULL,
    positionRow INT NOT NULL,
    positionCol INT NOT NULL,
    
    idBuilding INT NOT NULL,
    idSpecies INT NULL,
    
    currentHp INT NOT NULL DEFAULT 100,
    maxHp INT NOT NULL DEFAULT 100,
    removable TINYINT NOT NULL DEFAULT 1,
    
    PRIMARY KEY (idPark, positionRow, positionCol),
    CONSTRAINT fkTilePark FOREIGN KEY (idPark) REFERENCES park(idUser) ON DELETE CASCADE,
    CONSTRAINT fkTileBuilding FOREIGN KEY (idBuilding) REFERENCES building(id),
    CONSTRAINT fkTileSpecies FOREIGN KEY (idSpecies) REFERENCES species(id),
    
	CONSTRAINT chkTileCurrentHp CHECK(currentHp BETWEEN 0 AND 100),
    CONSTRAINT chkTileMaxHp CHECK(maxHp BETWEEN 0 AND 100)
);

INSERT INTO species 
    (name, temporalRange, locomotionType, heightInMeters, weightInKilograms, diet, aggressiveness, hatchCost, hatchSuccessRate, ratingWeight) 
VALUES 
    (
        'compsognathus', 
        'Jurássico Superior', 'Bípede', 0.260, 3.000, 
        'carnívoro', 0.2, 50, 0.9, 0.5
    ),
    (
        'tiranossauro', 
        'Cretáceo Superior', 'Bípede', 4.000, 8000.000, 
        'carnívoro', 0.9, 1000, 0.5, 2.0
    ),
    (
        'espinossauro', 
        'Cretáceo Superior', 'Bípede', 4.500, 14000.000, 
        'carnívoro', 0.9, 1200, 0.4, 2.0
    ),
    (
        'braquiossauro', 
        'Jurássico Superior', 'Quadrúpede', 12.000, 40000.000, 
        'herbívoro', 0.4, 950, 0.5, 2.0
    ),
    (
        'coritossauro', 
        'Cretáceo Superior', 'Bípede/Quadrúpede', 2.500, 3000.000, 
        'herbívoro', 0.4, 150, 0.8, 1.0
    ),
    (
        'parassaurolofo', 
        'Cretáceo Superior', 'Bípede/Quadrúpede', 3.000, 2500.000, 
        'herbívoro', 0.4, 150, 0.8, 1.0
    ),
    (
        'triceratops', 
        'Cretáceo Superior', 'Quadrúpede', 3.000, 9000.000, 
        'herbívoro', 0.6, 250, 0.6, 1.5
    ),
    (
        'velociraptor', 
        'Cretáceo Superior', 'Bípede', 0.500, 15.000, 
        'carnívoro', 0.8, 100, 0.8, 1.0
    ),
    (
        'dilofossauro', 
        'Jurássico Inferior', 'Bípede', 2.000, 400.000, 
        'carnívoro', 0.5, 100, 0.8, 1.0
    ),
    (
        'anquilossauro', 
        'Cretáceo Superior', 'Quadrúpede', 1.700, 6000.000, 
        'herbívoro', 0.6, 300, 0.6, 1.5
    ),
    (
        'ceratossauro', 
        'Jurássico Superior', 'Bípede', 2.000, 980.000, 
        'carnívoro', 0.6, 250, 0.8, 1.5
    ),
    (
        'estegossauro', 
        'Jurássico Superior', 'Quadrúpede', 2.700, 5300.000, 
        'herbívoro', 0.6, 250, 0.6, 1.5
    );

INSERT INTO building (idUpgrade, name, category, durability, baseCost, placeable, upgradeCost) 
VALUES
	-- | TERRENO | --
	(
        null,
		'terrain-grass',
        'terrain', 
        default, 10, default, null
    ),
	(
        null,
		'terrain-trees',
        'terrain',
        default, 10, default, null
    ),
	(
        null,
		'terrain-dirt',
        'terrain',
        default, 10, default, null
    ),
	(
        null,
		'terrain-pond',
        'terrain',
        default, 10, default, null
    ),
    
	-- | CAMINHO | --
	(
        null,
		'path',
        'path',
        default, 50, default, null
    ),
	(
        null,
		'path-l',
        'path',
        default, 50, default, null
    ),
	(
        null,
		'path-t',
        'path',
        default, 50, default, null
    ),
	(
        null,
		'path-cross',
        'path',
        default, 50, default, null
    ),
	-- | CERCADOS | --
	(
        null,
		'enclosure-1',
        'enclosure',
        3, 100, default, 150
    ),
	(
        null,
		'enclosure-2',
        'enclosure',
        5, 250, 0, 350
    ),
	(
        null,
		'enclosure-3',
        'enclosure',
        8, 500, 0, null
    ),
	-- | CONSTRUÇÕES | --
	(
        null,
		'entrance',
        'building',
        default, 0, 0, null
    ),
	(
        null,
		'visitor-center',
        'building',
        default, 0, 0, null
    ),
	(
        null,
		'hatchery',
        'building',
        default, 250, default, null
    );

UPDATE building SET idUpgrade = 10 WHERE name = 'enclosure-1';
UPDATE building SET idUpgrade = 11 WHERE name = 'enclosure-2';

CREATE OR REPLACE VIEW vw_parkRating
AS 
SELECT u.id userId, IFNULL(LEAST(SUM(s.ratingWeight), 5), 0) rating
FROM user u
JOIN park p ON u.id = p.idUser
JOIN tile t ON p.idUser = t.idPark
LEFT JOIN species s ON t.idSpecies = s.id
GROUP BY userId;

CREATE OR REPLACE VIEW vw_tiles
AS
SELECT t.*, b.idUpgrade, b.name, b.category, b.durability, b.baseCost, b.upgradeCost
FROM user u
JOIN park p ON u.id = p.idUser
JOIN tile t ON p.idUser = t.idPark
JOIN building b ON t.idBuilding = b.id;

CREATE OR REPLACE VIEW vw_dinosaurs
AS
SELECT s.*, t.idPark, t.positionRow, t.positionCol
FROM user u
JOIN park p ON u.id = p.idUser
JOIN tile t ON p.idUser = t.idPark
JOIN species s ON t.idSpecies = s.id;

DELIMITER $$
CREATE PROCEDURE sp_registerUser(
	IN username VARCHAR(60),
    IN email VARCHAR(120),
    IN password VARCHAR(120)
) BEGIN

	DECLARE v_userId INT;

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error during user registration setup.';
	END;
    
    START TRANSACTION;
	-- 1. CRIAR USUÁRIO
    INSERT INTO `user`(name, email, password) VALUE (username, email, password);
    SET v_userId = LAST_INSERT_ID();
    
	-- 2. CRIAR PARQUE
	INSERT INTO park(idUser, name) VALUE(v_userId, CONCAT('Parque de ', username));
    
	-- 3. CRIAR TILES DO PARQUE (GRID 5X4) com construções predefinidas
	INSERT INTO tile(idPark, positionRow, positionCol, idBuilding, idSpecies, removable) 
	VALUES
	    -- 1° Linha
		(v_userId, 0, 0, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 0, 1, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 0, 2, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 0, 3, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 0, 4, (SELECT id FROM building WHERE name = 'entrance'), default, 0),
		-- 2° Linha
		(v_userId, 1, 0, (SELECT id FROM building WHERE name = 'visitor-center'), default, 0),
		(v_userId, 1, 1, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 1, 2, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 1, 3, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 1, 4, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		-- 3° Linha
		(v_userId, 2, 0, (SELECT id FROM building WHERE name = 'hatchery'), default, default),
		(v_userId, 2, 1, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 2, 2, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 2, 3, (SELECT id FROM building WHERE name = 'enclosure-1'), (SELECT id FROM species WHERE name = 'parassaurolofo'), 0),
		(v_userId, 2, 4, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		-- 4° Linha
		(v_userId, 3, 0, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 3, 1, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 3, 2, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 3, 3, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default),
		(v_userId, 3, 4, (SELECT id FROM building WHERE category = 'terrain' ORDER BY RAND() LIMIT 1), default, default);
    
    -- 4. ATUALIZAR DADOS DO PARQUE
	UPDATE park
		SET balance = 1000, rating = (SELECT rating FROM vw_parkRating WHERE userId = v_userId)
	WHERE idUser = v_userId;
    
	COMMIT;
END$$
DELIMITER ;

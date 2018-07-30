CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, department_name, stock_quantity) VALUES
	("ham sandwich", "sandwiches", 94),
    ("crocodile", "pets", 32),
    ("dragon", "mythical creatures", 3),
    ("dragon egg", "mythical foods", 200),
    ("khakis", "pants", 64),
    ("screw driver", "tools", 500),
    ("black pens", "office supplies", 9000),
    ("water", "liquids", 5000),
    ("forks", "kitchen", 6505),
    ("tennis balls", "sports/outdoor", 9543);
    
SELECT * FROM products








CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    department_name VARCHAR(50),
    stock_quantity INT NOT NULL
);

INSERT INTO products (product_name, price, department_name, stock_quantity) VALUES
	("ham sandwich", 5, "sandwiches", 94),
    ("crocodile", 3000, "pets", 32),
    ("dragon", 1000000, "mythical creatures", 3),
    ("dragon egg", 500000, "mythical foods", 200),
    ("khakis", 20, "pants", 64),
    ("screw driver", 5, "tools", 500),
    ("black pen", .50, "office supplies", 9000),
    ("water", 2, "liquids", 5000),
    ("fork", 2, "kitchen", 6505),
    ("tennis ball", 2, "sports/outdoor", 9543);
    
SELECT * FROM products








var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var color = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bamazon"
});

var productDisplay = new Table({
    head: ["Product ID", "Product Name", "Price ($)", "Department Name", "Stock Quantity"],
});

inquirer.prompt({
    name: "managerChoice",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for sale", "View low inventory products", "Add to inventory", "Add new product"]
}).then(function(answers) {
    if (answers.managerChoice === "View Products for sale") {
        viewProd();
    }

    else if (answers.managerChoice === "View low inventory products") {
        lowInv();
    }

    else if (answers.managerChoice === "Add to inventory") {
        addInv();
    }

    else if (answers.managerChoice === "Add new product") {
        addProd();
    }
});

function viewProd() {
    connection.query("SELECT * FROM products", function(err, res, fields) {
        if (err) throw err;
        res.forEach(function(item, ind) {
            productDisplay.push([item.id, item.product_name, item.price, item.department_name, item.stock_quantity])
        })
        console.log(productDisplay.toString());
        connection.end();
    })
};

function lowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res, fields) {
        if (err) throw err;
        res.forEach(function(item, ind) {
            productDisplay.push([item.id, item.product_name, item.price, item.department_name, item.stock_quantity])
        })
        console.log(productDisplay.toString());
        connection.end();
    })
};

function addInv() {

    var productArr = [];
    var quantityArr = [];
    var chosenProduct;
    var chosenQuantity;

    connection.query("SELECT * FROM products", function (error, results, fields) {
        if (error) throw error;
        results.forEach(function(item, index) {
            productArr.push(item.product_name);
            quantityArr.push(item.stock_quantity);
        });
        
        inquirer.prompt([
            {
                name: "product",
                type: "list",
                message: "Which product's stock would you like to update?",
                choices: productArr
            },

            {
                name: "number",
                type: "input-validated",
                message: "How many would you like to add",
                validate(number) {
                    if (!/\d/.test(number)) {
                        console.log("\nPlease input a valid number.\n".red);
                        return;
                    }
                    return true;
                }
            }
        ]).then(function(answers) {
            chosenProduct = answers.product;
            chosenQuantity = quantityArr[productArr.indexOf(chosenProduct)];
            newQuant = chosenQuantity + answers.number;
            connection.query(`UPDATE products SET stock_quantity = ${newQuant} WHERE product_name = "${chosenProduct}"`, function(err, res, fields) {
                if (err) throw err;
                
                connection.query("SELECT * FROM products", function(err, res, fields) {
                    if (err) throw err;
                    res.forEach(function(item, ind) {
                        productDisplay.push([item.id, item.product_name, item.price, item.department_name, item.stock_quantity])
                    })
                    console.log(productDisplay.toString());
                    console.log("You've successfully updated your stock!".green);
                    connection.end();
                })
            })
        })
    });
}

function addProd() {
    //inquirer for product_name, price, department_name, stock_quantity
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "New product name"
        },

        {
            name: "price",
            type: "input",
            message: "New product price", 
            validate(price) {
                if (!/\d/.test(price)) {
                    console.log("\nPlease input a valid number.\n".red);
                    return;
                }
                return true;
            }
        },

        {
            name: "dept",
            type: "input",
            message: "New product department"
        },

        {
            name: "stock",
            type: "input-validated",
            message: "New product quantity",
            validate(stock) {
                if (!/\d/.test(stock)) {
                    console.log("\nPlease input a valid number.\n".red);
                    return;
                }
                return true;
            }
        }
    ]).then(function(answers) {
        connection.query(`INSERT INTO products (product_name, price, department_name, stock_quantity) VALUES ("${answers.product}", ${answers.price}, "${answers.dept}", ${answers.stock})`, function(err, res, fields) {
            if (err) throw err;

            connection.query("SELECT * FROM products", function(err, res, fields) {
                if (err) throw err;
                res.forEach(function(item, ind) {
                    productDisplay.push([item.id, item.product_name, item.price, item.department_name, item.stock_quantity])
                })
                console.log(productDisplay.toString());
                console.log("You've successfully added a new product!".green);
                connection.end();
            })
        })
    })
}
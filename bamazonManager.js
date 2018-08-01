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
                type: "number",
                message: "How many would you like to add",
                validate(number) {
                    if (number === NaN) {
                        return false;
                    }

                    else {
                        console.log("\nPlease choose a valid number.\n".red);
                    }
                }
            }
        ]).then(function(answers) {
            console.log(answers);
            // chosenProduct = answers.product;
            // chosenQuantity = quantityArr[productArr.indexOf(chosenProduct)];
            // newQuant = chosenQuantity + answers.number;
            // connection.query(`UPDATE products SET stock_quantity = ${newQuant} WHERE product_name = ${chosenProduct}`, function(err, res, fields) {
            //     if (err) throw err;
            //     console.log(res);
            // })
        })
    });
}
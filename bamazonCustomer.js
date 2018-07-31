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

var idArr = [];
var productArr = [];
var quantityArr = [];
var priceArr = [];

connection.connect();

//code here
var productDisplay = new Table({
    head: ["Product ID", "Product Name", "Price ($)", "Department Name", "Stock Quantity"],
});

connection.query("SELECT * FROM products AS products", function (error, results, fields) {
    if (error) throw error;
    results.forEach(function(item, index) {
        productDisplay.push([item.id, item.product_name, item.price, item.department_name, item.stock_quantity]);
        idArr.push(item.id.toString());
        productArr.push(item.product_name);
        quantityArr.push(item.stock_quantity);
        priceArr.push(item.price);
    });
    console.log(productDisplay.toString());

    inquirer.prompt([
        {
            name: "idChoice",
            type: "list",
            message: "Choose the ID of the product you would like to purchase.",
            choices: idArr
        }
    ]).then(function(answers) {
        var productInd = idArr.indexOf(answers.idChoice);
        var chosenProduct = productArr[productInd];
        var chosenQuant = quantityArr[productInd];
        var chosenPrice = priceArr[productInd];

        inquirer.prompt([
            {
                type: "input-validated",
                message: `How many ${chosenProduct}(s) would you like to purchase`,
                name: "quantity",
                validate(quantity) {
                    if (quantity > chosenQuant) {
                        console.log(`\nWe don't have enough stock to fulfill your order of ${quantity} ${chosenProduct}(s).  Please choose a different quantity.\n`.red);
                    }

                    else {
                        return true;
                    }
                }
            }
        ]).then(function(answers) {
            subtotal = chosenPrice * answers.quantity;
            console.log(`Your order has been fulfilled!  That will be $${subtotal}`);
        })
    })
});

//code end here

connection.end();
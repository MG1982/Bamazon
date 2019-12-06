let mysql = require("mysql");
let inquirer = require("inquirer");
let Table = require("cli-table");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bootcamp",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);
    showProducts();
});

let showProducts = function () {
    let query = "Select * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        let showTable = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
            colWidths: [10, 40, 20, 10, 10]
        });

        for (let i = 0; i < res.length; i++) {
            showTable.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        } console.log(showTable.toString());
        //Call the buy product function here...
        buyProduct();
    })
}
let buyProduct = function () {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "Select a product to purchase by it's ID",
        filter: Number
    },
    {
        name: "QTY",
        type: "input",
        message: "How many would you like to purchase?",
        filter: Number
    }
    ]).then(function (answer) {
        let selectedID = answer.ID;
        let orderQuantity = answer.QTY;
        //TEST LOGS
        console.log(selectedID)
        console.log(orderQuantity)
    })
}


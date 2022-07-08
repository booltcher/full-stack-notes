## Nodejs持久化

### 文件系统数据库

```js
// fsdb.js
// 实现一个文件系统读写数据库
const fs = require("fs");
function get(key) {
  fs.readFile("./db.json", (err, data) => {
    const json = JSON.parse(data);
    console.log(json[key]);
  });
}
function set(key, value) {
  fs.readFile("./db.json", (err, data) => {
    // 可能是空文件，则设置为空对象
    const json = data ? JSON.parse(data) : {};
    json[key] = value; // 设置值
    // 重新写入文件
    fs.writeFile("./db.json", JSON.stringify(json), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("写入成功！");
    });
  });
}
// 命令行接口部分
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", function (input) {
  const [op, key, value] = input.split(" ");
  if (op === "get") {
    get(key);
  } else if (op === "set") {
    set(key, value);
  } else if (op === "quit") {
    rl.close();
  } else {
    console.log("没有该操作");
  }
});
rl.on("close", function () {
  console.log("程序结束");
  process.exit(0);
});

```





### Nodejs原生驱动

> mysql2/promise

```js
(async () => {
  const mysql = require("mysql2/promise");
  const cfg = {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "school",
  };
  const connection = await mysql.createConnection(cfg);
  const [rows] = await connection.execute("select * from student");
  console.log(rows);
})();
```



### Nodejs ORM - Sequelize

> Sequelize

```js
(async () => {
  const Sequelize = require("sequelize");

  const sequelize = new Sequelize("school", "root", "123456", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,
  });

  const Fruit = sequelize.define("Fruit", {
    name: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.FLOAT, allowNull: false },
    stock: { type: Sequelize.INTEGER, defaultValue: 0 },
  });

  let ret = await Fruit.sync({ force: true });

  // insert
  ret = await Fruit.create({
    name: "苹果",
    price: 3.5,
    stock: 100,
  });

  // query
  ret = await Fruit.findAll({
    where: {
      name: "苹果",
    },
  });

  // update
  ret = await Fruit.update({
    name: "香蕉",
    price: 4.5,
    stock: 200,
  });
})();
```


































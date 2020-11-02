const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const dynamoDB = require("./config/config");

app.set("view engine", "ejs");
app.set("views", "./views");

const products = [
  {
    masp: 1,
    tensp: "cafe",
    gia: "2121",
    anh: "https://via.placeholder.com/150",
  },
  {
    masp: 2,
    tensp: "den da",
    gia: "4545",
    anh: "https://via.placeholder.com/150",
  },
  {
    masp: 3,
    tensp: "o do",
    gia: "4577",
    anh: "https://via.placeholder.com/150",
  },
  {
    masp: 4,
    tensp: "o long",
    gia: "2222",
    anh: "https://via.placeholder.com/150",
  },
];

app.get("/", (req, res) => {
  let params = {
    TableName: "Products",
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      res.render("index", {
        data: products,
        dataP: data.Items,
      });
    }
  });
});

app.post("/add", (req, res) => {
  const { ma, ten, gia, anh } = req.body;
  const product = {
    masp: parseInt(ma),
    tensp: ten,
    gia: gia,
    soluong: 1,
    anh: anh,
  };
  const params = {
    TableName: "Products",
    Item: product,
  };
  dynamoDB.put(params, (err, data) => {
    if (err) {
      console.error("Errors:", JSON.stringify(err, null, 2));
    } else {
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => {
  const { ma } = req.body;
  let params = {
    TableName: "Products",
    Key: {
      masp: parseInt(ma),
    },
  };
  dynamoDB.delete(params, (err, data) => {
    if (err) {
      console.error("Errors:", JSON.stringify(err, null, 2));
    } else {
      res.redirect("/");
    }
  });
});

app.post("/update", (req, res) => {
  const { sl, ma, slup,maup } = req.body;
  if (sl) {
    return res.render("updateForm", {
      sl: sl,
      ma: ma,
    });
  }

  let params = {
    TableName: "Products",
    Key: {
      masp: parseInt(maup),
    },
    UpdateExpression: "set #soluong=:sl",
    ExpressionAttributeNames: {
      "#soluong": "soluong",
    },
    ExpressionAttributeValues: {
      ":sl": slup,
    },
    ReturnValues: "UPDATED_NEW",
  };
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error("Errors:", JSON.stringify(err, null, 2));
    } else {
      res.redirect("/");
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server ${PORT}`));

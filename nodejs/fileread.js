let fs = require("fs");
fs.readFile("sample.text", "utf-8", function (err, data) {
  console.log(data);
});

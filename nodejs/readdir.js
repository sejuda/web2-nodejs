var testFolder = "data";
// ./ => 현재디렉토리라는 뜻 그래서 ./data 랑 똑같다.

// 0412
//0413 test
// ../ =:> 상위디렉토리
var fs = require("fs");

fs.readdir(testFolder, function (err, filelist) {
  //   console.log(filelist);
});

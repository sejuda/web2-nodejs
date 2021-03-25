let http = require("http");
let fs = require("fs");
let qs = require("querystring");
let url = require("url"); // url 이라는 모듈을 사용하겠다.
//객체화 dd
//d
// 주석을 쓰면안되는건가?
let template = {
  html: function (title, list, body, controll) {
    return `
    <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${controll}
    ${body}
  </body>
  </html>
  `;
  },
  list: function (filelist) {
    let list = `<ul>`;
    let i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + `</ul>`;
    return list;
  },
};

let app = http.createServer(function (request, response) {
  let _url = request.url;
  let queryData = url.parse(_url, true).query;

  let pathname = url.parse(_url, true).pathname;
  // console.log(pathname);
  //   console.log(queryData.id);

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        console.log(filelist);
        let description = "hello 2node.js";
        let title = "welcome";
        let list = template.list(filelist);
        let html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir("./data", function (error, filelist) {
        // console.log(filelist);

        fs.readFile(
          `data/${queryData.id}`,
          "utf-8",
          function (err, description) {
            let title = queryData.id;
            let list = template.list(filelist);
            let html = template.html(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> 
               <a href="/update?id=${title}">update</a>
               <form action="delete_process" method="post" >
               <input type="hidden" name="id" value="${title}">
               <input type="submit" value="delete">
               </form>
               `
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }

    //   console.log("what server:" + __dirname + _url); // 터미널 창에 나타남 ( 터미널창을(노드로) 서버를 작동시키고있음)
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      let title = "WEB - create";
      let list = template.list(filelist);
      let html = template.html(
        title,
        list,
        `
        <form action="/create_process" method="POST">
  <p><input type="text" name="title" placeholder="title"/></p>
  <p>
    <textarea name="description" placeholder="description"></textarea>
  </p>
  <p>
    <input type="submit" />
  </p>
</form>

        
        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    let body = "";
    request
      .on("data", (data) => {
        body = body + data;
      })
      .on("end", () => {
        let post = qs.parse(body);
        let title = post.title;
        let description = post.description;
        // console.log(post);
        fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end("success");
        });
      });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      // console.log(filelist);

      fs.readFile(`data/${queryData.id}`, "utf-8", function (err, description) {
        let title = queryData.id;
        let list = template.list(filelist);
        let html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="POST">
          <input type = "hidden" name="id" value=${title}>
          <p><input type="text" name="title" placeholder="title" value=${title} /></p>
          <p>
            <textarea name="description" placeholder="description"  >${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
          
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    let body = "";
    request
      .on("data", (data) => {
        body = body + data;
      })
      .on("end", () => {
        let post = qs.parse(body);
        let id = post.id;
        let title = post.title;
        let description = post.description;
        fs.rename(`data/${id}`, `/data${title}`, (err) => {});
        console.log(post);
        // console.log(post);
        fs.writeFile(`data/${title}`, description, "utf-8", (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
  } else if (pathname === "/delete_process") {
    let body = "";
    request
      .on("data", (data) => {
        body = body + data;
      })
      .on("end", () => {
        let post = qs.parse(body);
        let id = post.id;
        fs.unlink(`data/${id}`, (err) => {
          response.writeHead(302, { Location: `/` });
          response.end();
        });
      });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);

const git = require("simple-git");

// git()
//   .branch()
//   .then((res) => {
//     console.log(res);
//   });

git()
  .show("master:package.json")
  .then((res) => {
    console.log(JSON.parse(res).name);
  });

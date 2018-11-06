let Hamoni = require("hamoni-sync");

let hamoni = new Hamoni("ad1ab491-3ca6-49f4-8f2a-51103881d5b2", "512e53278e8e4e3f85691a651dfae8b5");

hamoni
  .connect()
  .then(response => {
    hamoni
      .createList("react-spreadsheet", [
        { id: 0, name: "James K", age: 21 },
        { id: 1, name: "Jimmy M", age: 45 }
      ])
      .then(() => console.log("create success"))
      .catch(error => console.log(error));
  })
  .catch(error => console.log(error));
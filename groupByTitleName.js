///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from "sqlite3";

const groupBySqlite = () => {
  var start = new Date();

  var db4 = new sqlite3.Database("db/sqlite3.db");

  console.log("Group Column | Group Count");
  db4.each(
    `SELECT COUNT(*) as count, titlename FROM persons group BY titlename`,
    function (err, row) {
      console.log(row.titlename + " " + row.count);
    },
    function () {
      var end = new Date() - start;
      console.info("[SQLite] Czas grupowania danych: %dms", end);
    }
  );
};

//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from "nedb";

const groupByNedb = () => {
  var start = new Date();

  var db3 = {};

  let groupValues = [];

  db3.persons = new Datastore("db/nedb/persons.db");
  db3.persons.loadDatabase();

  db3.persons.find({}, function (err, docs) {
    for (let i = 0; i < docs.length; i++) groupValues.push(docs[i].titleName);
    groupValues = [...new Set(groupValues)];

    console.log("Group Column | Group Count");
    for (let i = 0; i < groupValues.length; i++) {
      db3.persons.count({ titleName: groupValues[i] }, function (err, count) {
        console.log(groupValues[i] + " " + count);
        if (i == groupValues.length - 1) {
          var end = new Date() - start;
          console.info("[Nedb] Czas grupowania danych: %dms", end);
        }
      });
    }
  });
};

///////////////////////////////////////////////// LowDB //////////////////////////////////////////

import { join, dirname, format } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import lodash from "lodash";

async function groupByLowDB() {
  var start = new Date();

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, "db/lowdb.json");
  const adapter = new JSONFile(file);
  const db2 = new Low(adapter);

  await db2.read();
  db2.data ||= { users: [] };

  db2.chain = lodash.chain(db2.data);

  const users = db2.chain.get("users").countBy("name.title").value();

  console.log("Group Column | Group Count");

  console.log("Madame " + users.Madame);
  console.log("Mademoiselle " + users.Mademoiselle);
  console.log("Miss " + users.Miss);
  console.log("Monsieur " + users.Monsieur);
  console.log("Mr " + users.Mr);
  console.log("Mrs " + users.Mrs);
  console.log("Ms " + users.Ms);

  var end = new Date() - start;
  console.info("[LowDB] Czas wczytywania i wyswietlania danych: %dms", end);
}

////////////////////////////////////////////// LevelDB /////////////////////////////////////////////

import levelup from "levelup";
import leveldown from "leveldown";

const groupByLevelDB = () => {
  var start = new Date();

  var db = levelup(leveldown("db/levelDB"));

  const keys = [];

  const titleNames = [];

  let count = 0;
  let i = 0;
  db.createKeyStream()
    .on("data", function (data) {
      if (i % 28 == 0) count++;
      i++;
    })
    .on("end", function (data) {
      i = 0;
      let str, key;
      db.createKeyStream()
        .on("data", function (data) {
          if (i < count) {
            str = data + "";
            key = str.split(":");
            keys.push(key[1]);
          } else if (i == count) return;
          i++;
        })
        .on("end", function (data) {
          for (let i = 0; i < keys.length; i++) {
            db.get(`titleName:${keys[i]}`, function (err, value) {
              if (err) return console.log("Ooops!", err);
              titleNames.push(value);

              if (i == keys.length - 1) {
                let Madame = 0;
                let Mademoiselle = 0;
                let Miss = 0;
                let Monsieur = 0;
                let Mr = 0;
                let Mrs = 0;
                let Ms = 0;

                for (let i = 0; i < titleNames.length; i++)
                  if (titleNames[i] == "Madame") Madame++;
                  else if (titleNames[i] == "Mademoiselle") Mademoiselle++;
                  else if (titleNames[i] == "Miss") Miss++;
                  else if (titleNames[i] == "Monsieur") Monsieur++;
                  else if (titleNames[i] == "Mr") Mr++;
                  else if (titleNames[i] == "Mrs") Mrs++;
                  else if (titleNames[i] == "Ms") Ms++;

                console.log("Madame " + Madame);
                console.log("Mademoiselle " + Mademoiselle);
                console.log("Miss " + Miss);
                console.log("Monsieur " + Monsieur);
                console.log("Mr " + Mr);
                console.log("Mrs " + Mrs);
                console.log("Ms " + Ms);

                var end = new Date() - start;
                console.info(
                  "[LevelDB] Czas wczytywania i wyswietlania danych: %dms",
                  end
                );
              }
            });
          }
        });
    });
};

// groupBySqlite();
groupByNedb();
// groupByLowDB();
// groupByLevelDB();

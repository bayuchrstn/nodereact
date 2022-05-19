const { GeneralModel } = require("../models");
const Validator = require("fastest-validator");
const v = new Validator();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const readXlsxFile = require("read-excel-file/node");

const sequelize = new Sequelize("db_project", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (count,data, page, limit) => {
  const result = data;
  const totalItems = count;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, result, totalPages, currentPage };
};

const getSettings = async (req, res) => {
  const { page, size, search, sort, direction } = req.query;
  const { limit, offset } = await getPagination(page, size);
  var kondisi_limit = '';
  var kondisi_sort = '';
  var count = 0;
  var kondisi= ' WHERE a.active=1';
  var kondisi_count= ' WHERE a.active=1';
  if(search){
    kondisi = ' WHERE a.active=1 AND (a.name LIKE "%' + search + '%" OR a.value LIKE "%' + search + '%" OR a.desc LIKE "%' + search + '%") GROUP BY a.id';
    kondisi_count = ' WHERE a.active=1 AND (a.name LIKE "%' + search + '%" OR a.value LIKE "%' + search + '%" OR a.desc LIKE "%' + search + '%")';
  }
    kondisi_limit = ' LIMIT ' + limit + ' OFFSET ' + offset;
  if (sort && direction) {
      kondisi_sort = ' ORDER BY a.'+sort+' '+ direction; 
  }
  sequelize
    .query(
      "SELECT COUNT(*) AS `count` FROM general_settings a " + kondisi_count ,
      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      if(data){
        count = data[0].count;
      }else{
        count = 0;
      }
      
    });
  sequelize
    .query(
      "SELECT a.*, @rownum := @rownum + 1 AS row_num FROM general_settings a, (SELECT @rownum := "+offset+") b " + kondisi + kondisi_sort + kondisi_limit ,
      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      const response = getPagingData(count,data, page, limit);
      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

const getAllSetting = (req, res) => {
  sequelize
    .query(
      "SELECT a.*, @rownum := @rownum + 1 AS row_num FROM general_settings a, (SELECT @rownum := 0) b  WHERE a.active=1 GROUP BY a.id ORDER BY id ASC ;",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then((results) => {
      if (!results) {
        return res.status(404).send("Data Tidak Ditemukan");
      }
      res.json(results);
    });
};

const getSetting = (req, res) => {
  const id = req.params.id;
  GeneralModel.findOne({
    where: {
      id: id,
      active: 1
    },
  }).then(function (general) {
    if (!general) {
      return res.status(404).send("Data Tidak Ditemukan");
    }
    res.json(general);
  });
};

const createSetting = (req, res) => {
  const schema = {
    name: "string",
    value: "string",
    desc: "string|optional",
  };
  const validate = v.validate(req.body, schema);

  GeneralModel.findOne({
    where: {
      name: req.body.name,
      active: 1
    },
  }).then(function (name) {
    if (name) {
      return res.status(400).json({ msg: "Nama Sudah Terdaftar" });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }

    try {
      console.log(req.body);
      GeneralModel.create(req.body);
      res.status(200).json({ msg: "Data Berhasil Di Input" });
    } catch (error) {
      res.status(400).json(error);
    }
  });
};

const updateSetting = (req, res) => {
  const id = req.params.id;

  const data = GeneralModel.findByPk(id);

  if (!data) {
    return res.status(400).json({ msg: "ID Tidak Terdaftar" });
  }

  const schema = {
    name: "string",
    value: "string",
    desc: "string|optional",
  };

  const validate = v.validate(req.body, schema);

  GeneralModel.findOne({
    where: {
      name: req.body.name,
      active: 1
    },
  }).then(function (name) {
    if (name) {
      return res.status(400).json({ msg: "Nama Sudah Terdaftar" });
    }
    if (validate.length) {
      return res.status(400).json(validate);
    }
    try {
      GeneralModel.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ msg: "Data Berhasil Di Update" });
    } catch (error) {
      res.status(400).json({ msg: "Data Gagal Di Update" });
    }
  });
};

const deleteSetting = (req, res) => {
  const id = req.params.id;

  const data = GeneralModel.findByPk(id);

  if (!data) {
    return res.status(400).json({ msg: "ID Tidak Terdaftar" });
  }

  GeneralModel.update(
    { active: 0 },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(function (result) {
    if (result) {
      res.status(200).json({ msg: "Data Berhasil Di Hapus" });
    } else {
      res.status(400).json({ msg: "Data Gagal Di Hapus" });
    }
  });
};

const upload = async (req, res) => {
  if (req.file == undefined) {
    return res.status(400).json({ msg: "Please upload an excel file!" });
  }
  let path =
    __basedir + "/resources/static/assets/uploads/" + req.file.filename;
  let dataArray = [];
  await readXlsxFile(path).then((rows) => {
    // skip header
    rows.shift();
    rows.forEach((row) => {

      let data = {
        name: row[0],
        value: row[1],
        desc: row[2],
      };
      dataArray.push(data);
    });
  });
  if (dataArray.length === 0) {
    res.status(400).json({ msg: "Data File Kosong" });
  }

  const duplicate = new Promise((resolve) => {
    var valueArr = dataArray.map(function (item) { return item.name });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
    if (isDuplicate) {
      resolve("Ada Data Nama Yang Sama");
    } else {
      resolve(null);
    }
  });

  const msg = new Promise((resolve) => {
    dataArray.forEach(async (row) => {
      let exist = false;
      if (row.name == null) {
        resolve("Nama Tidak Boleh kosong");
      } else if (row.value == null) {
        resolve("Value Tidak Boleh kosong");
      } else {
        exist = await GeneralModel.findOne({
          where: {
            name: row.name,
            active: 1
          },
        }).then(name => {
          if (name) {
            return "Nama Sudah Terdaftar";
          }
        });
      }


      if (exist) {
        resolve(exist);
      } else {
        resolve(null);
      }
    });
  });

  const duplicated = await duplicate;
  const message = await msg;
  console.log(message);
  console.log(duplicated);
  if (await msg == null && await duplicate == null) {
    GeneralModel.bulkCreate(dataArray)
      .then((result) => {
        if (result) {
          res.status(200).json({
            msg: "Upload File " + req.file.originalname + " Sukses",
          });
        } else {
          res.status(200).json({
            msg: "Gagal Di upload",
          });
        }

      })
      .catch((error) => {
        res.status(500).json({
          message: "Fail to import data into database!",
          error: error.message,
        });
      });
  } else {
    if (message == null) {
      res.status(400).json({ msg: duplicated })
    } else if (duplicated == null) {
      res.status(400).json({ msg: message })
    } else {
      res.status(400).json({ msg: message + ' & ' + duplicated })
    }

  }

};

module.exports = {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  getAllSetting,
  upload
};

const express = require(`express`);
const app = express();
const bodyParser = require(`body-parser`);
const mongoose = require(`mongoose`);
mongoose.connect(`mongodb://0.0.0.0:27017/urlshort`);
const { UrlModel } = require(`./models/url.model`);

app.use(express.static(`public`));
app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({ extended: false }));
app.get(`/`, function (req, res) {
  let allUrls = UrlModel.find()
    .then(function (allUrlData) {
      res.render(`home`, {
        allUrlData,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post(`/create`, function (req, res) {
  //console.log(req.body.longUrl);
  let myRanNumer = Math.floor(Math.random() * 10000);
  let newUrlShort = new UrlModel({
    longUrl: req.body.longUrl,
    shortUrl: myRanNumer,
  });
  newUrlShort
    .save()
    .then(function (saveData) {
      res.redirect("/");
      console.log(saveData);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get(`/:shortId`, function (req, res) {
  UrlModel.findOne({ shortUrl: req.params.shortId }).then(function (data) {
    UrlModel.findByIdAndUpdate({ _id: data.id }, { $inc: { clickCount: 1 } })
      .then(function (UpdateData) {
        res.redirect(data.longUrl);
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});
app.get("/delete/:id", function (req, res) {
  UrlModel.findByIdAndDelete({ _id: req.params.id })
    .then(function () {
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log(`The app is listening in PORT 3000`);
});

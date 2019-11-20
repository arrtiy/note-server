var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const chalk = require('chalk')
var ObjectID = require('mongodb').ObjectID;

// 允许所有的请求形式
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://172.23.102.172:27017/note"

app.get('/', function(req, res) {
  res.send('Hello, word!')
})

app.post('/add', bodyParser.json(), function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    let myobj = req.body
    let dbo = db.db("note")
    dbo.collection("note").insertOne(myobj, function(err, res) {
      if (err) throw err
      db.close()
    })
    res.send('新增成功!')
  })
})

app.get('/delete', bodyParser.json(), function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    var dbo = db.db("note")
    dbo.collection("note").findAndRemove({_id: new ObjectID(req.query.id)})
    res.send('删除成功!')
  })
})

app.get('/update', bodyParser.json(), function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    let dbo = db.db("note")
    dbo.collection("test"). find({}).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.send(JSON.stringify(result))
      db.close()
    })
  })
})

app.get('/search', bodyParser.json(), function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    let dbo = db.db("note")
    dbo.collection("note"). find({}).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.send(JSON.stringify(result))
      db.close()
    })
  })
})

app.post('/filterData', bodyParser.json(), function(req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err
    let myobj = req.body
    delete myobj.uid
    let dbo = db.db("note")
    let qand = []
    for (let prop in myobj) {
      if (!myobj[prop]) {
        delete myobj[prop]
      } else {
        if (prop !== 'comment') {
          qand.push({[prop]: myobj[prop]})
        }
      }
    }
    let query = {}
    if (myobj.comment) {
      let comment = myobj.comment
      delete myobj.comment
      query = {
        $or : [{comment : {$regex : `.\*${comment}.\*`}}],
        $and: qand
      }
    } else {
      query = {...myobj}
    }
    console.log('lhz query:', query)
    dbo.collection("note"). find(query).toArray(function(err, result) { // 返回集合中所有数据
      if (err) throw err
      res.send(JSON.stringify(result))
      db.close()
    })
  })
})

app.listen(3000)

console.log(`  App running at:`)
console.log(`  - Local:   ${chalk.cyan("http://localhost:3000")}`)
var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

app.use('/api', apiRoutes)

app.get('/api/getDiscList',(req,res) => {
  // res 是一个ServerResponse对象
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    // response包含status\statusText\headers\config\request\data等多字段， 只需返回前台所需data字段即可
    // res.jaon()  && res.send()
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/getLyric',(req,res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url,{
    headers: {
      referer: 'ttps://y.qq.com/portal/player.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    var ret = response.data
    // 返回的是json字符串  需要匹配提取数据
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/getSongList',(req,res) => {
  // res 是一个ServerResponse对象
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://y.qq.com/n/yqq/playsquare/4161064256.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    // response包含status\statusText\headers\config\request\data等多字段， 只需返回前台所需data字段即可
    // res.jaon()  && res.send()
    var ret = response.data
    // 返回的是json字符串  需要匹配提取数据
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(err => {
    console.log(err)
  })
})

app.get('/api/getTopList',(req,res) => {
  // res 是一个ServerResponse对象
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url,{
    headers: {
      referer: 'https://m.y.qq.com',
      origin: 'https://m.y.qq.com'
    },
    params: req.query
  }).then(response => {
    // response包含status\statusText\headers\config\request\data等多字段， 只需返回前台所需data字段即可
    // res.jaon()  && res.send()
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})


app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
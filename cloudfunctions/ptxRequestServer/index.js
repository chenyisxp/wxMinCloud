// //get请求方式可行
// const cloud = require('wx-server-sdk')
// cloud.init()
// const apirequest = require('request-promise')

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const options = {
//     method: 'POST',
//       // url: "http://101.132.238.199:3000/front/mainactivity",
//     // body: JSON.stringify( { jsonparams: { "txCode": "ac010002", "deviceId": "", "sessionId": "", "custId": "", "timestamp": "202001091392", "reqParams": { "fromUserCode": "user_202001071435482487" } }}),
//     url: "http://101.132.238.199:3000/front/mainactivity?jsonparams=" + event.jsonparams,
//     // headers: {
//     //   'content-type': 'application/json',
//     //   'User-Agent': 'Request-Promise',
//     //   // 'ACCESS_TOKENID': 'qhshilin-100216'
//     // },
//     // json: true 
//   }
//   return apirequest(options).then(function (res) {
//     console.log(res)
//     return res

//   }).catch(function (err) {
//     console.error(err)
//     return err
//   })
// }


// 云函数入口文件
const cloud = require('wx-server-sdk')

const got = require('got'); //引用 got

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event:' + JSON.stringify(event))
  console.log('context', context)
  //let getResponse = await got('httpbin.org/get') //get请求 用httpbin.org这个网址做测试 
  //return getResponse.body
  let postResponse = await got('http://101.132.238.199:3000/minfront/mainactivity', {
    method: 'POST', //post请求
    headers: {
      'Content-Type': 'application/json'
    },
    // body: JSON.stringify({ jsonparams: { "txCode": "ac010002", "deviceId": "", "sessionId": "", "custId": "", "timestamp": "202001091392", "reqParams": { "fromUserCode": "user_202001071435482487" } } })
    body: JSON.stringify(event)
  })

  return postResponse.body //返回数据
}
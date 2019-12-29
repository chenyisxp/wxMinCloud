// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'test-518543' //测试云Id
  }
)
//操作excel用的类库
const xlsx = require('node-xlsx');
// 云函数入口函数
exports.main = async (event, context) => {
  // return await cloud.database().collection('ac_user_info').get();
  console.log(event);

  try {
    let { userdata } = event

    //1,定义excel表格名
    let openId = 'openid1111111'             // 模拟openid
    //2，定义存储数据的
    let alldata = [];
    let row = ['姓名', '时间', '地点']; //表属性
    alldata.push(row);

    for (let key in userdata) {
      let arr = [];
      arr.push(userdata[key].userName);
      arr.push(userdata[key].city + userdata[key].company);
      arr.push(userdata[key].nDate + userdata[key].nTime);
      alldata.push(arr)
    }
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "来访用户",
      data: alldata
    }]);
    console.log(111111111111+new Date())
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: `download/sheet${openId}.xlsx`,    // excel文件名称及路径，即云存储中的路径
      fileContent: buffer, //excel二进制文件
      success:res=>{
        console.log(res)
      },
      fail:console.error.errMsg
    })
    console.log(222+new Date())
  } catch (e) {
    console.error(e)
    return e
  }
}
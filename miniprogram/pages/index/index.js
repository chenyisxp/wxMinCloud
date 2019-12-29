//index.js
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    sendTime:'获取验证码',
    snsMsgWait:60,
    multiIndex: [0, 0],
    multiArray: [['上海', '浙江'], ['绿地金服', '上海公司']],
    multiTimeIndex: [0, 0],
    multiTimeArray: [],
    //输入框的值
    userMobile:'',
    userToMobile:'',
    userName:'',
    mCode:'',
    paramInfo:{},
    dbInfoList:{},
    sysSmsFlag:''
  },
  //01、初始化函数
  onLoad: function() {
    //计算日期 今天及后面几天
    let dateArr = this.GetDateStr(10);
    let timeArr = ['16:00', '16:30', '17:00', '17:30', '18:00'];
    this.setData({
      multiTimeArray: [dateArr,timeArr]
    })
    this.getUserDbHisFuc();//获取用户openId
    this.getSysParams();//读取系统配置
  },
  //02、获取系统配置
  getSysParams(){
    db.collection('sp_app_param').where({
      code_name:'sysSmsFlag',
      rec_stat:'1'
    }).get().then(res => {
      console.log(res.data)
      if(res.data.length>0){
        this.setData({
          sysSmsFlag: res.data[0].code_val
        })
        console.log(this.data.sysSmsFlag)
      } 
      
    })
  },
  getUserDbHisFuc() {
    this.getOpenid();
  },
  //03、获取用户唯一标识身份openId
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('云函数获取到的openid: ', res)
        that.setData({
          openId: res.result.openid
        })
        app.globalData.openId = res.result.openid;
        this.getDbList();
      }
    })
  },
  //04、用户信息查询 如果存在带着信息前往 预约成功页面
  getDbList() {
    db.collection('ac_user_info').where({
      rec_stat: 1
    }).orderBy('create_Time', 'desc').get().then(res => {
      console.log(res.data)
      this.setData({
        dbInfoList: res.data
      })
      console.log(res.data)
      if (res.data.length > 0) {
        wx.navigateTo({
          url: '../history/index?' + 'paramInfo=' + JSON.stringify(res.data[0])
          // url: '../history/index'
        })
      }
    })
  },
  //构建地址 一级选择
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  //构建地址 联动
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['绿地金服', '上海公司'];
            break;
          case 1:
            data.multiArray[1] = ['杭州项目','萧山项目'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  //构建时间选择 keys
  bindMultiTimerPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiTimeIndex: e.detail.value
    })
  },
  //构建时间选择 value
  bindMultiPickerTimerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiTimeArray: this.data.multiTimeArray,
      multiTimeIndex: this.data.multiTimeIndex
    };
    data.multiTimeIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiTimeIndex[0]) {
          case 0:
            // data.multiTimeArray[1] = ['绿地金服', '上海公司'];
            break;
          case 1:
            // data.multiTimeArray[1] = ['杭州项目', '萧山项目'];
            break;
        }
        data.multiTimeIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  // 获取日期 今天及后面几天的日期集合
  GetDateStr(AddDayCount) {
    let dd = new Date();
    let rstArr =[];
    for(let i=0;i<AddDayCount;i++){
      dd.setDate(dd.getDate() + i);//获取AddDayCount天后的日期  
      var y = dd.getFullYear();
      var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0  
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0  
      rstArr.push(y + "年" + m + "月" + d+'日');
    }
    return rstArr;
  },
  //05、获取验证码操作
  handleSendCheckCodeFuc() {
    console.log(this.data.userMobile)
    let flag = this.checkPhone(this.data.userMobile);
    if (!flag) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    if (this.data.smsFlag) {
      return;
    }
    //产生 验证码同时 存进数据库
    let mobileCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    // sys_message_histroy
    let info = {
      mobileCode: mobileCode,
      mobileNum: this.data.userMobile,
      cre_tm: this.getNowDate,
      date: new Date(),
      rec_stat: 1
    }
    db.collection('sys_message_histroy').add({
      // data 字段表示需新增的 JSON 数据
      data: info
    }).then(res => {
    }).catch(console.error)

    console.log(mobileCode);
    let inter = setInterval(function () {
      this.setData({
        smsFlag: true,
        sendColor: '#cccccc',
        sendTime: this.data.snsMsgWait + 's后重发',
        snsMsgWait: this.data.snsMsgWait - 1
      });
      if (this.data.snsMsgWait < 0) {
        clearInterval(inter)
        this.setData({
          sendColor: '#363636',
          sendTime: '发送验证码',
          snsMsgWait: 60,
          smsFlag: false
        });
      }
    }.bind(this), 1000);
    //调用 短信发送
    console.log(this.data.sysSmsFlag)
    if (this.data.sysSmsFlag == 'true') {
      wx.cloud.callFunction({
        name: 'sendsms',
        data: {
          mobile: this.data.userMobile,
          nationcode: mobileCode
        },
        success: res => {
          console.log('[云函数] [sendsms] 调用成功')
          console.log(res)
        },
        fail: err => {
          console.error('[云函数] [sendsms] 调用失败', err)
        }
      })
    } else {
      wx.showToast({
        title: '验证码是:' + mobileCode,
        icon: 'none'
      })
    }

  },
  //06、提交按钮操作=>1、获取短信验证码 2、一些列操作
  subBtnFuc(e){
    let checkRst =false;
    //0、验证码校验
    db.collection('sys_message_histroy').where({
      rec_stat: 1,
      _openid:app.globalData.openId
    }).orderBy('date', 'desc').limit(1).get().then(res => {
      console.log(res.data)
      let arr = res.data;
      for(let i =0 ;i<arr.length;i++){
        if (arr[i].mobileCode == this.data.mCode){
          checkRst =true;
        }
      }
      // ********************** //
        if (!checkRst) {
          wx.showToast({
            title: '请输入正确的验证码',
            icon: 'none'
          })
          return checkRst;
        }

        //保存到数据库
        let tempDate = new Date();
        let info = {
          userToMobile: this.data.userToMobile,
          userName: this.data.userName,
          userMobile: this.data.userMobile,
          city: this.data.multiArray[0][this.data.multiTimeIndex[0]],
          company: this.data.multiArray[1][this.data.multiTimeIndex[1]],
          nDate: this.data.multiTimeArray[0][this.data.multiTimeIndex[0]],
          nTime: this.data.multiTimeArray[1][this.data.multiTimeIndex[0]],
          version: 0,//版本控制
          creatDate: this.getNowDate(),
          create_Time: tempDate,
          update_Time: tempDate,
          rec_stat: 1//有效无效标识
        }
        this.setData({
          paramInfo: info
        })
        //服务通知 id 采集
        this.addFormIdFuc(e.detail.formId, tempDate);
        //保存到message
        this.addUpdateMessageTb();
        //＊＊＊＊＊＊＊＊＊＊＊＊＊＊／／
        //服务通知
        this.sendServerMsgFuc();
        //发送订阅消息
        // this.handleCallFuc();
        //记录
        this.sendSubMsg();
        //跳转
        this.dbUpdateFuc(this.data.paramInfo);
    })
  
  },
  //07、获得订阅一次性消息权限
  handleCallFuc() {
    let that = this;
    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
        tmplIds: ['oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8'],
        success: (res) => {
          console.log(res)
        }
      })

    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级后重试',
      })
    }
  },
  inputByMobileFuc(e){
    console.log(e);
    this.setData({
      userMobile: e.detail.value
    })
  },
  inputMCodeFuc(e){
    this.setData({
      mCode: e.detail.value
    })
  },
  inputByNameFuc(e) {
    console.log(e);
    this.setData({
      userName: e.detail.value
    })
  },
  inputByFromMobileFuc(e){
    this.setData({
      userToMobile: e.detail.value
    })
  },
  //获取当前格式化时间
  getNowDate(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var newMonth = month;
    var date = d.getDate();
    var newDate = date;
    var helloInfo;
    if(month<10) {
      newMonth = 0 + "" + month;
    }
    if(date<10) {
      newDate = 0 + "" + date;
    }
    var todayDate =  year + "年" + newMonth + "月" + newDate +"日";
    return todayDate;
  },
  //新增用户预约信息 同时跳转页面
  dbUpdateFuc(info) {
    const db = wx.cloud.database();
    //新增
        db.collection('ac_user_info').add({
          // data 字段表示需新增的 JSON 数据
            data: info
        }).then(res => {
          console.log(res)
          //有值
          if (res._id){
            wx.redirectTo ({
              url: '../history/index?' + 'paramInfo=' + JSON.stringify(this.data.paramInfo)
            })
          }else{
            wx.showToast({
              title: '失败',
              icon: 'fail',
              duration: 2000
            })
          }
        }).catch(console.error)
      
    },
    //新增操作=>记录模版消息id
    addFormIdFuc(formId, tempDate){
      // const db = wx.cloud.database();
      //新增
      let info ={
        // openId: app.globalData.openId,
        formId: formId,
        create_Time: tempDate,
        update_Time: tempDate,
        rec_stat: 1//有效无效标识
      }
      db.collection('ac_fetch_formid').add({
        // data 字段表示需新增的 JSON 数据
        data: info
      }).then(res => {
        console.log(res)
      }).catch(console.error)
    },
    //取得模版消息id 并调用云函数实现调用及更新
    sendServerMsgFuc(){
      let that =this;
      let fromid = '';
      let _id ='';
      db.collection('ac_fetch_formid').where({
        _openid: app.globalData.openId,
        rec_stat: 1
      }).get().then(res => {
        console.log(res.data)
        if (res.data.length > 0) {
          fromid = res.data[0].formId;
          _id = res.data[0]._id;
          console.log('111111111111111111111111111111')
          console.log(fromid)
          if (fromid) {
            wx.cloud.callFunction({
              name: 'serverMsgPush',
              data: {
                formId: fromid,
                openId: app.globalData.openId,
                mobile: that.data.paramInfo.userMobile,
                time: that.data.paramInfo.nDate + ' ' + that.data.paramInfo.nTime,
                address: that.data.paramInfo.city + ' ' + that.data.paramInfo.company
              },
              success(res) {
                console.log("推送成功", res)
                that.updateAcFormDb(_id);
              },
              fail(res) {
                console.log("推送失败", res)
              }
            })
          }
        }
      })
    
    },
    //更新操作=>使用后的模版消息id置为无效
    updateAcFormDb(_id){
      db.collection('ac_fetch_formid')
        .doc(_id)
        .update({
          data: {
            rec_stat: 0,
          },
        });
    },
    //记录 订阅通知 消息记录
    addUpdateMessageTb(){
      console.log(this.data.paramInfo)
      //新增
      let info = {
        // openId: app.globalData.openId,
        data:{
          // date3: { value: "2019-10-22"},
          // name1: { value: "陈依" },
          // phone_number4: { value: "1312222222" },
          // phrase4: { value: "水去也" },
          // thing2:{value:'消息通测试'}
       
          name1: { value: this.data.paramInfo.userName },
          thing2: { value: this.data.paramInfo.city + ' ' + this.data.paramInfo.company },
          date3: { value: this.data.paramInfo.nDate + ' ' + this.data.paramInfo.nTime },
          phone_number4: { value: this.data.paramInfo.userMobile }
        },
        templateId: "oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8",
        page: "index",
        touser: app.globalData.openId,
        done: false//有效无效标识
      }
      db.collection('messages').add({
        // data 字段表示需新增的 JSON 数据
        data: info
      }).then(res => {
        console.log(res)
      }).catch(console.error)
    },
  checkPhone(phone){
      return (/^1[3456789]\d{9}$/.test(phone));
  },
  //调用云函数发送 订阅消息
  sendSubMsg(){
    let that =this;
    wx.cloud.callFunction({
      name: 'send',
      data: {
        data: {
          page: { value: 'index' },
          date3: { value: '20192122' },
          thing2: { value: '小程序之云开发学习' },
          name1: { value: '长安' },
          phone_number4: { value: '1311111111' },
        },
        date3: '2010年1月2日' ,
        thing2: '上海绿地金服' ,
        name1:  '长安' ,
        phone_number4: '1311111111' ,
        templateId: 'oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8',
        touser: 'oAe_S5Ph96X5P9f30QwtLzivsSM4'
      },
      success(res) {
        console.log("推送成功", res)
        // that.dbUpdateFuc(that.data.paramInfo);
      },
      fail(res) {
        console.log("推送失败", res)
      }
    })
  },
  //转发相关配置
  onShareAppMessage: function (res) {
    return {
      title: '体验绿地香港行政助理小程序',
      path: '/pages/index/index',
      success: function (res) {
        // console.log('转发成功--------' + this.path)
      },
      fail: function (res) {
      }
    }
  },
})
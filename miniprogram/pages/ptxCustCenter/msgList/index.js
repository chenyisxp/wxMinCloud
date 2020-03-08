// miniprogram/pages/ptxCustCenter/msgList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText:'',
    msgList:[
      // {messageType:1,content:'欢迎1',sendTime:''},
      // { messageType: 0, content: '欢迎2', sendTime: '2019-109-10' },
      // { messageType: 1, content: '欢迎3', sendTime: '' },
      // { messageType: 1, content: '欢迎4', sendTime: '' },
    ],
    msgListFlag:false,
    scrollToView:'',
    libBoxShow:true,
    scrollTop:0,
    inputBottom:0,
    timer:{},
    times:1000,//刷新频率
    subMitBoxFlag:false,//关闭
    chatType:'',
    requestTime:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chatType:app.globalData.chatType
    })
    console.log(app.globalData.userCode, app.globalData.fromUserCode)
    if (app.globalData.userCode && app.globalData.fromUserCode){
      this.timer =setInterval(()=>{
        this.queryMsgList();
      }, this.data.times)
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      libBoxShow: false
    })
    this.setData({
      scrollToView:'key_4',
      scrollTop:1000
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      scrollToView: 'key_4'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  queryMsgList(){
    if (this.data.requestTime==1){
      this.setData({
        requestTime:2
      })
      wx.showLoading({
        title: '查询中,请稍后...',
      })
    }
    
    //查询操作
    wx.cloud.callFunction({
      name: 'ptxRequestServer',
      data: {
        jsonparams: {
          "txCode": "ac010002", "deviceId": "", "sessionId": "", "custId": "", "timestamp": new Date().getTime() +"", "reqParams": {
            receiveUserCode: app.globalData.userCode,
            fromUserCode: app.globalData.fromUserCode
          }
        }
      },
      success: res => {
        let resp = JSON.parse(res.result);
        console.log(this.data.chatType)
        if (resp.respCode == '0000'
            && resp.respData.respCode=='0000'){
          this.setData({
            msgList: resp.respData.msgList
          })
          if (resp.respData.msgList.length>0){
            this.setData({
              msgListFlag:true
            })
          }else{
            //如果是查看就要停止定时器
            this.setData({
              msgListFlag: false
            })
          }
          if (this.data.chatType == '2') {
            clearInterval(this.timer)
          }
          // console.log('aaaa:'+this.data.msgListFlag)
          this.setData({
            scrollTop: 1000 * resp.respData.msgList.length  // 这里我们的单对话区域最高1000，取了最大值，应该有方法取到精确的
          });
          // console.log(1000 * resp.respData.msgList.length)
          wx.hideLoading();
        }

        
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '聊天信息读取失败',
          icon: 'none'
        })
        clearInterval(this.timer)
      }
    })
  },
  bindTextAreaBlur(event){
    this.setData({
      inputText: event.detail.value
    })
  },
  handleCallFuc(){
    if (!this.data.inputText){
      return;
    }
    console.log(this.data.inputText);
    //查询操作
    wx.cloud.callFunction({
      name: 'ptxRequestServer',
      data: {
        jsonparams: {
          "txCode": "ac010001", "deviceId": "", "sessionId": "", "custId": "", "timestamp": new Date().getTime() + "", "reqParams": { 
            ip:'0.0.0.0',
            times:'2',
            messageType:'1',//回复
            content: this.data.inputText,
            fromUserCode: app.globalData.fromUserCode,
            receiveUserCode: app.globalData.userCode,
            isRead:1
          }
        }
      },
      success: res => {
       //刷新列表
        // this.queryMsgList();
        this.setData({
          inputText:''
        })
      },
      fail: res => {
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    })
  },
  //输入聚焦

  foucus: function (e) {
    var that = this;
    that.setData({
      inputBottom: e.detail.height
    })
  },


  //失去聚焦
  blur: function (e) {
    var that = this;
    that.setData({
      inputBottom: 0
    })
  },
  onPageScroll: function (e) {
    console.log(e);//{scrollTop:99}
  },
  handleScroll(e){
    console.log(e)
    //滚动时 清除
    clearInterval(this.timer);
    

  },
  handleLower(e){
    console.log('来了来了绿绿绿绿绿绿绿绿')
    //滚到底部时，重新开启
    if (app.globalData.userCode && app.globalData.fromUserCode) {
      this.timer = setInterval(() => {
        this.queryMsgList();
      }, this.data.times)
    }
  }
  //用户输入内容--提交输入
  // submit: function () {
  //   var that = this;
  //   console.info(that.data.inputText);
  //   if (!that.data.inputText) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '请输入内容'
  //     })
  //     return false;
  //   }

  //   talkList.push({
  //     who: 2,
  //     text: that.data.inputText
  //   })

  //   that.setData({
  //     talkList: talkList,
  //     inputText: '',
  //     //inputBottom: 0
  //   })

  //   that.scrollToBottom();
  // },
})
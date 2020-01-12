// miniprogram/pages/ptxCustCenter/index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryMsgCardList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  queryMsgCardList() {
    wx.cloud.callFunction({
      name: 'ptxRequestServer',
      data: { jsonparams: { "txCode": "ac010005", "deviceId": "", "sessionId": "", "custId": "", "timestamp": "202001091392", "reqParams": {} }},
      success: res => {
        wx.showToast({
          title: '地址读取成功,请耐心等待',
          icon: 'none',
          duration: 3000
        })
        console.log(res)
        if (res.errMsg =='cloud.callFunction:ok' 
           && res.result){
          let resp = JSON.parse(res.result);
          if (resp.respCode=='0000'
            && resp.respData.respCode=='0000'){
            this.setData({
              userList: resp.respData.msgList
            })
            console.log(resp.respData.msgList)
          }
          
        }
      },
      fail: res => {
        wx.showToast({
          title: '地址错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  urlencode(str) {
    str = (str + '').toString();

    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
      replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
  },
  handleConnect(event){
    console.log(event)
    let fromusercode = event.target.dataset.fromusercode;
    let fromuserip = event.target.dataset.fromuserip;
    if (!fromusercode || !fromuserip){
      console.log(fromusercode, fromuserip)
      wx.showToast({
        title: '参数不能为空',
        icon: 'none'
      })
      return;
    }
    app.globalData.fromUserCode = fromusercode;
    wx.showModal({
      title: '提示',
      content: '确定要接入吗？' + fromusercode + fromuserip,
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //更新操作
          wx.cloud.callFunction({
            name: 'ptxRequestServer',
            data: { jsonparams: { "txCode": "ac010004", "deviceId": "", "sessionId": "", "custId": "", "timestamp": "202001091392", "reqParams": {
              chatType:1,
              ip: fromuserip,
              fromUserCode: fromusercode,
              receiveUserCode: app.globalData.userCode
            } } },
            success: res => {
              wx.navigateTo({
                url: 'msgList/index'
              })
            },
            fail: res => {
              wx.showToast({
                title: '接入失败',
                icon: 'none'
              })
            }
          })

          
        } else if (sm.cancel) {
         
        }
      }
    })
  }
})
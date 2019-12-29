// miniprogram/pages/testFuc/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sendServerMsgFuc();
    // this.sendFuc()

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
  //发送服务通知
  sendServerMsgFuc() {
      wx.cloud.callFunction({
        // name: 'subscribe',
        name:'serverMsgPush',
        data: {
          touser: { value: 'oAe_S5Ph96X5P9f30QwtLzivsSM4' },
          data: {
            page: { value: 'index' },
            date3: { value: '20192122' },
            thing2: { value:'小程序之云开发学习'},
            name1: { value: '长安' },
            phone_number4:{value:'1311111111'},
          },
          templateId: 'oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8',
          openId: 'oAe_S5Ph96X5P9f30QwtLzivsSM4',
          formId:'3e2d533e03ff447f871c865d7267268e'

        },
        success(res) {
          console.log("推送成功", res)
        },
        fail(res) {
          console.log("推送失败", res)
        }
      })
  },
  sendFuc() {
    wx.cloud.callFunction({
      name: 'send',
      data: {
        data:{
          page: { value: 'index' },
          date3: { value: '20192122' },
          thing2: { value: '小程序之云开发学习' },
          name1: { value: '长安' },
          phone_number4: { value: '1311111111' },
        },
        date3: '2010年1月2日',
        // thing2: { value: '上海绿'},
        thing2: '上海绿',
        name1: '长安',
        phone_number4: '1311111111',
        templateId: 'oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8',
        touser: 'oAe_S5Ph96X5P9f30QwtLzivsSM4' 
      },
      success(res) {
        console.log("推送成功", res)
      },
      fail(res) {
        console.log("推送失败", res)
      }
    })
  },
  handleCallFuc(){
    console.log(wx.requestSubscribeMessage)
    if (wx.requestSubscribeMessage){
      wx.requestSubscribeMessage({
        tmplIds: ['oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8'],
        success:(res)=>{
          console.log(res)
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级后重试',
      })
    }
  }
})
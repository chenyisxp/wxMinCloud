// miniprogram/pages/ptxCustCenter/testActivityMsg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId:'1044_dNVGZP5be/Rv35xcFPG7hxS30E8MgVcrUSeggCvqteGID6pnaW-yuelkzMYOcmmgbwOXrPLllALgg574'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  handleCreate(){
    let that = this;
    wx.cloud.callFunction({
      name: 'miniActiveMessagFuc',
      data:{
        operateType: '1',
      },
      complete: res => {
        console.log('云函数获取到的openid: ', res)

      }
    })
  },
  handleShare(){
    wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage: true,
      activityId: this.data.activityId, // 活动 ID
      templateInfo: {
        parameterList: [{
          name: 'member_count',
          value: '1'
        }, {
          name: 'room_limit',
          value: '3'
        }]
      }
    })
  },
  handleUpdate() {
    wx.cloud.callFunction({
      name: 'miniActiveMessagFuc',
      data:{
        operateType:'2',
        data: { "activity_id": "1044_YFg7ZJCzi9YrsnFuFPG7hxS30E8MgVcrUSeggNIDgJyJzUrz_XNNiDTARBYXhvaRrhfOtoldoh0Pov8K", "target_state": 0, "template_info": { "parameter_list": [{ "name": "path", "value": "pages\/home\/dashboard\/index" }, { "name": "member_count", "value": "2" }, { "room_limit": "4", "value": "1" }] } }
      },
      complete: res => {
        console.log('云函数获取到的openid: ', res)

      }
    })
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
    
  }
})
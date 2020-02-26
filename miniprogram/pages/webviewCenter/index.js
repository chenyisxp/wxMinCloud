// miniprogram/pages/webviewCenter/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wurl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log('11112');
    // this.onLoad();
    var test = ["101", "102", "103"];
    let version = test[Math.floor(Math.random() * test.length)]
    console.log(version)
    
    this.setData({
      wurl: 'http://101.132.238.199/' + version+'/#/'
    })
    this.onLoad();
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
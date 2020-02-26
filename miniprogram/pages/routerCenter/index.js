// miniprogram/pages/routerCenter/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password:'',
    hiddenmodalput:true

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

  },
  handleGo(e){
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  handleGoPtx(e){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
    // if (this.data.password!='@2008'){
    //   wx.showToast({
    //     title: '密码不正确',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return;
    // }
    // wx.navigateTo({
    //   url: e.currentTarget.dataset.url,
    // })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    if (this.data.password!='@2008'){
      wx.showToast({
        title: '密码不正确',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: '../ptxCustCenter/index',
    })
  },
  userPasswordInput(e){
    this.setData({
      password: e.detail.value
    })
    // console.log(e)
  }

})
//index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    info:{
      userToMobile:'',
      city:'',
      company:'',
      nDate:'',
      nTime:''
    },
    dbInfoList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
    console.log(options);
    if (options.paramInfo){
      this.setData({
        info: JSON.parse(options.paramInfo)
      })
    }
    this.getDbList();
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
   * 打电话
   */
  handleCallFuc(event){
    let telNo = event.target.dataset.tel;
    if (telNo){
      wx.makePhoneCall({
        phoneNumber: telNo
      })
    }
  },
  /**
   * 撤销
   */
  handleCancelFuc(){
    //TODO 数据库删除操作
  
  },
  getDbList(){
    const db = wx.cloud.database()
    db.collection('ac_user_info').where({
        rec_stat: 1,
        _openid: app.globalData.openId
    }).orderBy('create_Time', 'desc')
    .get().then(res => { 
      console.log(res.data) 
      this.setData({
        dbInfoList: res.data
      })
    })
  },
  update: function (event) {
    //console.log(event)
    db.collection('books').doc(this.data.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        title: "局部更新"
      },
      success: function (res) {

      }
    })
  },
  //撤销更新操作
  handleCancelUpdateFuc(){
    const db = wx.cloud.database();
    console.log(this.data.dbInfoList)
    for (let i = 0; i < this.data.dbInfoList.length;i++){
      console.log(this.data.dbInfoList[i]._id)
      db.collection('ac_user_info').doc(this.data.dbInfoList[i]._id).update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 rec_stat 字段置为 0
          rec_stat: 0
        },
        success: function (res) {
          console.log(res)
          if (res.stats.updated==1){
            wx.showToast({
              title: '撤销成功',
              icon: 'none'
            })
            wx.navigateTo({
              url: '../index/index'
            })
          }
        }
      })
    }
  },
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('云函数获取到的openid: ', res)
        that.setData({
          openId: res.result.openid
        })
      }
    })
  },
  //去管理中心
  handleGoToManage(){
    wx.redirectTo ({
      url: '../manageCenter/index'
    })
  },
  //前往ai页面
  handleGoAiChat(){
    wx.navigateTo({
      url: '../aiChat/index'
    })
  },
  //分享配置
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
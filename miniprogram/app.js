//app.js
const app = getApp();
var plugin = requirePlugin("chatbot");
App({
  onLaunch: function () {
    // 1、初始化 环境及数据库选择
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-518543',
        traceUser: true,
      })
    }
    // 2、有版本更新时会提示
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败',
        mask: false,
        icon: 'fail',
        duration: 2500
      })
    })

    //3、openai插件 初始化
    // plugin.init({
    //   appid: "cO92U3vXDGJoBc2NFJJGCix6zGqw03", //小程序示例账户，仅供学习和参考
    //   openid: "",//用户的openid，非必填，建议传递该参数
    //   success: () => { }, //非必填
    //   fail: error => { } //非必填
    // });
    plugin.init({
      appid: "P5Ot9PHJDechCYqDFAW1AiK6OtG3Ja",
      success: () => { },
      fail: error => { },
      guideList: ["您好", "地址", '面试有那些环节', '聊聊天'],
      textToSpeech: true, //默认为ture打开状态
      welcome: "请问有什么需要帮助？",
      welcomeImage: 'http://inews.gtimg.com/newsapp_bt/0/10701537095/1000',
      background: "rgba(247,251,252,1)",
      guideCardHeight: 40,
      operateCardHeight: 145,
      history: true,
      historySize: 60,
      navHeight: 0,
      robotHeader: 'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/leftHeader.png',
      userHeader: 'https://res.wx.qq.com/mmspraiweb_node/dist/static/miniprogrampageImages/talk/rightHeader.png',
      userName: ''
    });
    // this.globalData={
    //   url: 'https://sitassess.greenlandfs.com/',
    //   webviewurl: 'https://sitassess.greenlandfs.com/',
    //   userCode: 'user001'
    // }
    this.overShare();
  },
  //重写分享方法
  overShare: function () {
    //监听路由切换
    //间接实现全局设置分享内容
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        console.log('是否重写分享方法', data.isOverShare);
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function () {
            //你的分享配置
            return {
              title: '来组团啊',
              path: '/pages/index/index',
              imageUrl: 'https://assess-sit.oss-cn-hangzhou.aliyuncs.com/share.png'
            };
          }
        }
      }
    })
  },
  globalData: {
    url: 'https://sitassess.greenlandfs.com/',
    webviewurl: 'https://sitassess.greenlandfs.com/',
    userCode: 'user001',
    fromUserCode: 'user_202001111622122055',//当前会话的code
    gChatType: ''//全局聊天状态
  }
})

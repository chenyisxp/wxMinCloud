//  * @Author: cone
//  * @Description: 发送订阅消息

const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init();
  const db = cloud.database();

  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        done: false,
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        const date3 = '2019年12月25日';
        const thing2 = message.thing2;
        let name1 = message.name1;
        let phone_number4 = message.phone_number4;
         cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          // data: message.data,
          templateId: message.templateId,
          data: {
            date3: { value: date3},
            thing2: { value: "预约成功通知"},
            name1: { value: '测试用户'},
            phone_number4: { value: '13111111111'}
          },
          page: { value: 'index' },
          touser: message.touser,
          templateId: 'oEPLesE0TYbRVOIc7lbMci9LP8q8AcCbDz8S0EusUz8'
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              // done: true,
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};
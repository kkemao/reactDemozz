import mqtt from 'mqtt';
// import config from '../../utils/config';

// NORMAL(0),    // 正常告警
// STRANGER(1),  // 陌生人告警
// EXCEPTIONAL_TIME(2),   // 异常时间告警
// MISSING(3);            // 人员失踪告警
// 对应mqtt告警消息的NoticeType

function parseAlarm(str) {
  var alarmObj = {};
  str
    .replace(/"/g, '')
    .slice(1, -1)
    .split(',')
    .forEach(function(item) {
      var key = item.split(':')[0].trim();
      var value = item.split(':')[1].trim();
      alarmObj[key] = value;
    });
  return alarmObj;
}

export default {
  connect() {
    var client = mqtt.connect({
      host: window.$IF.env.mqttServer.host,
      port: window.$IF.env.mqttServer.port,
      clientId:
        'IF_MQTT_JS_Client/' +
        Math.random()
          .toString(16)
          .substr(2, 8)
    });
    client.parseAlarm = str => {
      var alarmObj = {};
      str
        .replace(/'/g, '')
        .slice(1, -1)
        .split(',')
        .forEach(function(item) {
          var key = item.split(':')[0].trim();
          var value = item.split(':')[1].trim();
          alarmObj[key] = value;
        });
      return alarmObj;
    };
    client.on('connect', function() {
      console.log('连接MQTT服务成功!');
    });
    client.on('reconnect', function() {
      console.log('mqtt正在尝试重新连接...');
    });

    client.on('offline', function() {
      console.log('mqtt连接出错');
      client.unsubscribe('0/#');
    });

    client.on('close', function() {
      console.log('MQTT服务成功关闭!');
    });
    return client;
  },
  listen(client, cb) {
    client.subscribe('0/#', function() {
      console.log('mqtt预订消息成功');
    });
    client.subscribe('IFMessage', function() {
      console.log('mqtt预订IFMessage消息成功');
    });
    client.on('message', function(topic, message) {
        console.log('zml mqtt topic--message',topic);
      if (message.toString().indexOf("'AlarmId':-1") !== -1) return;
      var message_str = message.toString().replace(/'/g, '"');
      console.warn('mqttMessageArrived', topic, message_str);
      var res = JSON.parse(message_str);
      if(topic.indexOf('/')!=-1){
        const AlarmId = message_str.split(',')[0].split(':')[1];
        const FaceId = message_str.split('"FaceId":')[1].split(',')[0];
        res.AlarmId = AlarmId;
        res.FaceId = FaceId;
        res.CameraId = Number(topic.split('/')[1]);
      }
      console.warn('zml message_str parse之后', res);
      typeof cb === 'function' && cb(res);
    });
  }
};

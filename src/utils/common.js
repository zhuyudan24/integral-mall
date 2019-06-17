/*eslint-disable*/
export default {
  //输入框的输入限制
  getInputVal: function(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/gi) != null) byteValLen += 1;
      else byteValLen += 0.5;
      if (byteValLen > max) break;
      returnValue += val[i];
    }
    return returnValue;
  },
  // 一个汉子算一个，一个字母算一个
  //输入框的输入限制
  getInputValSin: function(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
      byteValLen += 1;
      if (byteValLen > max) break;
      returnValue += val[i];
    }
    return returnValue;
  },
  /*
   * 一个汉字算一个字,一个英文字母或数字算半个字
   */
  getZhLen: function(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i);
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 1;
      } else {
        len += 0.5;
      }
    }
    return Math.ceil(len);
  },
  // 时间戳转换成年月日
  getTime: function(time) {
    if (!isNaN(time)) time = Number(time);
    var now = new Date(time);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month >= 10 ? (month = month) : (month = '0' + month); //判断小于10月份的情况
    var date = now.getDate();
    date >= 10 ? (date = date) : (date = '0' + date); //判断小于10日的情况
    return year + '-' + month + '-' + date;
  },
  // 时间戳转换成时分秒
  getSeconds: function(time) {
    if (!isNaN(time)) time = Number(time);
    var now = new Date(time);
    var hour = now.getHours();
    hour >= 10 ? (hour = hour) : (hour = '0' + hour); //判断小于10的时的情况
    var minute = now.getMinutes();
    minute >= 10 ? (minute = minute) : (minute = '0' + minute); //判断小于10的分的情况
    var second = now.getSeconds();
    second >= 10 ? (second = second) : (second = '0' + second); //判断小于10的秒的情况
    return hour + ':' + minute + ':' + second;
  },
  // 时间戳转换成时分
  getHours: function(time) {
    if (!isNaN(time)) time = Number(time);
    var now = new Date(time);
    var hour = now.getHours();
    hour >= 10 ? (hour = hour) : (hour = '0' + hour); //判断小于10的时的情况
    var minute = now.getMinutes();
    minute >= 10 ? (minute = minute) : (minute = '0' + minute); //判断小于10的分的情况
    return hour + ':' + minute
  },
  // 时间戳转换成年月日时分秒
  formatDate: function(time) {
    if (!isNaN(time)) time = Number(time);
    var now = new Date(time);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month >= 10 ? (month = month) : (month = '0' + month); //判断小于10月份的情况
    var date = now.getDate();
    date >= 10 ? (date = date) : (date = '0' + date); //判断小于10日的情况
    var hour = now.getHours();
    hour >= 10 ? (hour = hour) : (hour = '0' + hour); //判断小于10的时的情况
    var minute = now.getMinutes();
    minute >= 10 ? (minute = minute) : (minute = '0' + minute); //判断小于10的分的情况
    var second = now.getSeconds();
    second >= 10 ? (second = second) : (second = '0' + second); //判断小于10的秒的情况

    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  }
};

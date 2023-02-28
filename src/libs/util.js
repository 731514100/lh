import moment from 'moment';
export const getBusinessTime = function(val) {
  return moment(val).format('YYYY-MM-DD');
};

export const getYesterday = function() {
  const beginTime = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD 00:00:00');
  const endTime = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD 23:59:59');
  return {
    beginTime,
    endTime
  };
};

export const getToday = function() {
  const beginTime = moment().format('YYYY-MM-DD 00:00:00');
  const endTime = moment().format('YYYY-MM-DD 23:59:59');
  return {
    beginTime,
    endTime
  };
};

export const getThisWeekDay = function() {
  const beginTime = moment()
    .day('Monday')
    .format('YYYY-MM-DD 00:00:00');
  const endTime = moment()
    .day('Monday')
    .day(+7)
    .format('YYYY-MM-DD 23:59:59');
  return {
    beginTime,
    endTime
  };
};

export const getThisMonth = function() {
  // 本月
  const beginTime = moment()
    .startOf('month')
    .format('YYYY-MM-DD 00:00:00');
  const endTime = moment()
    .endOf('month')
    .format('YYYY-MM-DD 23:59:59');
  return {
    beginTime,
    endTime
  };
};

export const getLastMonth = function() {
  // 本月
  const beginTime = moment().month(moment().month() - 1).startOf('month')
    .format('YYYY-MM-DD 00:00:00');
  const endTime = moment().month(moment().month() - 1).endOf('month')
    .format('YYYY-MM-DD 23:59:59');
  return {
    beginTime,
    endTime
  };
};

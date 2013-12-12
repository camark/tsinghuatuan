/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-12-3
 * Time: 下午11:12
 */

function clearActs() {
    $('#tbody-activities').html('');
}

function getSmartStatus(act) {
    if (act.status == 0) {
        return '未发布';
    } else if (act.status == 1) {
        var now = new Date();
        if (now < act.book_start) {
            return '等待订票';
        } else if (now < act.book_end) {
            return '正在订票';
        } else if (now < act.start_time) {
            return '正在出票';
        } else if (now < act.end_time) {
            return '活动进行中';
        } else {
            return '已结束';
        }
    } else {
        return '未知';
    }
}

function wrapTwoDigit(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}

function getChsDate(dt) {
    return wrapTwoDigit(dt.getDate()) + '日';
}

function getChsMonthDay(dt) {
    return (dt.getMonth() + 1) + '月' + getChsDate(dt);
}

function getChsFullDate(dt) {
    return dt.getFullYear() + '年' + getChsMonthDay(dt);
}

function getChsDay(dt) {
    var dayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return dayMap[dt.getDay()];
}

function getTimeStr(dt) {
    return wrapTwoDigit(dt.getHours()) + ':' + wrapTwoDigit(dt.getMinutes());
}

function isSameYear(d1, d2) {
    return d1.getFullYear() == d2.getFullYear();
}

function isSameMonth(d1, d2) {
    return isSameYear(d1, d2) && (d1.getMonth() == d2.getMonth());
}

function isSameDay(d1, d2) {
    return isSameYear(d1, d2) && isSameMonth(d1, d2) && (d1.getDate() == d2.getDate());
}

function getSmartTimeRange(start_time, end_time) {
    var result = getChsFullDate(start_time) + ' ' + getChsDay(start_time) + ' ' + getTimeStr(start_time) + ' - ';
    if (isSameDay(start_time, end_time)) {
        result += getTimeStr(end_time);
    } else if (isSameMonth(start_time, end_time)) {
        result += getChsDate(end_time) + ' ' + getChsDay(end_time) + ' ' + getTimeStr(end_time);
    } else if (isSameYear(start_time, end_time)) {
        result += getChsMonthDay(end_time) + ' ' + getChsDay(end_time) + ' ' + getTimeStr(end_time);
    } else {
        result += getChsFullDate(end_time) + ' ' + getChsDay(end_time) + ' ' + getTimeStr(end_time);
    }
    return result;
}

function getTd(para) {
    return $('<td class="td-' + para + '"></td>');
}

function expand_long_text(dom) {
    var newhtml = '', par = $(dom).parent(), refdata = par.text();
    dom = $(dom);
    refdata = refdata.substring(0, refdata.length - 3);
    newhtml = dom.attr('ref-data') + ' <a style="cursor:pointer;" ref-data="' + refdata + '" ref-hint="' + dom.text() + '" onclick="expand_long_text(this);">' + dom.attr('ref-hint') + '</a>';
    par.html(newhtml);
}

var tdMap = {
    'status': 'status',
    'name': 'text',
    'description': 'longtext',
    'activity_time': 'time',
    'place': 'text',
    'book_time': 'time',
    'operations': 'operation_links'
}, tdActionMap = {
    'status': function(act, key) {
        return getSmartStatus(act);
    },
    'text': function(act, key) {
        return act[key];
    },
    'longtext': function(act, key) {
        var str = act[key];
        if (str.length > 55) {
            str = str.substr(0, 55) + '... <a style="cursor:pointer;" ref-data="' + act[key] + '" ref-hint="收起" onclick="expand_long_text(this);">展开</a>';
        }
        return str;
    },
    'time': function(act, key) {
        return smartTimeMap[key](act);
    },
    'operation_links': function(act, key) {
        var links = act[key], result = [], i, len;
        for (i = 0, len = links.length; i < len; ++i) {
            result.push('<a href="' + links[i] + '" target="' + operations_target[i] + '"><span class="glyphicon glyphicon-' + operations_icon[i] + '"></span> ' + operations_name[i] + '</a>');
        }
        return result.join('<br/>');
    }
}, smartTimeMap = {
    'activity_time': function(act) {
        return getSmartTimeRange(act.start_time, act.end_time);
    },
    'book_time': function(act) {
        return getSmartTimeRange(act.book_start, act.book_end);
    }
};

function appendAct(act) {
    var tr = $('<tr></tr>'), key;
    for (key in tdMap) {
        getTd(key).html(tdActionMap[tdMap[key]](act, key)).appendTo(tr);
    }
    $('#tbody-activities').append(tr);
}

function initialActs() {
    var i, len;
    for (i = 0, len = activities.length; i < len; ++i) {
        appendAct(activities[i]);
    }
}

clearActs();
initialActs();

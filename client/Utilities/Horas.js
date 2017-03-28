export function time (start, end, interval) {

    var s = start.split(':').map(e => +e);

    var e = end.split(':').map(e => +e);

    var res = [];

    var t = [];

    while (!(s[0] == e[0] && s[1] > e[1])) {
        t.push(s[0] + ':' + (s[1] < 10 ? '0' +s[1] : s[1]));
        s[1] += interval;
        if (s[1] > 59) {
            s[0] += 1;
            s[1] %= 60;
        }
    }

    for (var i = 0; i < t.length - 1; i++) {
        res.push(t[i] /*+ " - " + t[i + 1]*/);
    }

    return res;
}

export function hoy () {

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;

  var yyyy = today.getFullYear();

  if (dd < 10){
      dd = '0' + dd;
  }

  if ( mm < 10){
      mm = '0' + mm;
  }

  return yyyy + '-' + mm + '-' + dd;
}

export function addMinutes(time, minsToAdd) {
    function z(n) {
        return (n < 10 ? '0' : '') + n;
    }

    let bits = time.split(':');
    let mins = bits[0] * 60 + (+bits[1]) + (+minsToAdd);

    return z(mins % (24 * 60) / 60 | 0) + ':' + z(mins % 60);
}

export function converToMinutes(time) {
    return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
}

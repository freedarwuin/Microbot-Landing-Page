var SEC_ARRAY = [
    60,
    60,
    24,
    7,
    365 / 7 / 12,
    12,
];

const EN_US = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

function localeFunc(diff, idx) {
    if (idx === 0) return ['just now', 'right now'];
    let unit = EN_US[Math.floor(idx / 2)];
    if (diff > 1) unit += 's';
    return [`${diff} ${unit} ago`, `in ${diff} ${unit}`];
}


function formatDiff(diff) {
    /**
     * if locale is not exist, use defaultLocale.
     * if defaultLocale is not exist, use build-in `en`.
     * be sure of no error when locale is not exist.
     *
     * If `time in`, then 1
     * If `time ago`, then 0
     */
    var agoIn = diff < 0 ? 1 : 0;
    /**
     * Get absolute value of number (|diff| is non-negative) value of x
     * |diff| = diff if diff is positive
     * |diff| = -diff if diff is negative
     * |0| = 0
     */
    diff = Math.abs(diff);
    /**
     * Time in seconds
     */
    var totalSec = diff;
    /**
     * Unit of time
     */
    var idx = 0;
    for (; diff >= SEC_ARRAY[idx] && idx < SEC_ARRAY.length; idx++) {
        diff /= SEC_ARRAY[idx];
    }
    /**
     * Math.floor() is alternative of ~~
     *
     * The differences and bugs:
     * Math.floor(3.7) -> 4 but ~~3.7 -> 3
     * Math.floor(1559125440000.6) -> 1559125440000 but ~~1559125440000.6 -> 52311552
     *
     * More information about the performance of algebraic:
     * https://www.youtube.com/watch?v=65-RbBwZQdU
     */
    diff = Math.floor(diff);
    idx *= 2;
    if (diff > (idx === 0 ? 9 : 1))
        idx += 1;
    return localeFunc(diff, idx, totalSec)[agoIn].replace('%s', diff.toString());
}

/**
 * calculate the diff second between date to be formatted an now date.
 * @param date
 * @param relativeDate
 * @returns {number}
 */
function diffSec(date, relativeDate) {
    const relDate = relativeDate ? toDate(relativeDate) : new Date();
    return (+relDate - +toDate(date)) / 1000;
}

/**
 * format Date / string / timestamp to timestamp
 * @param input
 * @returns {*}
 */
function toDate(input) {
    if (input instanceof Date) return input;
    // @ts-ignore
    if (!isNaN(input) || /^\d+$/.test(input)) return new Date(parseInt(input));
    input = (input || '')
        // @ts-ignore
        .trim()
        .replace(/\.\d+/, '') // remove milliseconds
        .replace(/-/, '/')
        .replace(/-/, '/')
        .replace(/(\d)T(\d)/, '$1 $2')
        .replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
        .replace(/([+-]\d\d):?(\d\d)/, ' $1$2'); // -04:00 -> -0400
    return new Date(input);
}

/**
 * format a TDate into string
 * @param date
 * @param locale
 * @param opts
 */
function format(date, locale, opts) {
    // diff seconds
    const sec = diffSec(date, opts && opts.relativeDate);
    // format it with locale
    return formatDiff(sec);
}
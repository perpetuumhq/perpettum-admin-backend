import moment from 'moment-timezone';

export default function localToUTC(date: Date, timeZone = "Asia/Kolkata") {
    try {
        const localTime = moment.tz(date, timeZone);
        const utcEquivalent = localTime.utc();
        return utcEquivalent.format();
    } catch (err) {
        console.log(err);
        return null;
    }
}
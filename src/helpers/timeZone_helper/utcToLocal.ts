import moment from 'moment-timezone';

export default function utcToLocal(utcDate: Date, timeZone = "Asia/Kolkata") {
    try {
        const utcMoment = moment.utc(utcDate);
        const localTime = utcMoment.tz(timeZone);
        return localTime.format();
    } catch (err) {
        console.log(err);
        return null;
    }
}

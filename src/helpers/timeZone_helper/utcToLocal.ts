import moment from 'moment-timezone';

export default function utcToLocal(utcDate: Date, timeZone = "Asia/Kolkata", time = false) {
    try {
        const utcMoment = moment.utc(utcDate);
        const localTime = utcMoment.tz(timeZone);
        if (time) {
            return localTime.valueOf();
        }
        return localTime.format();
    } catch (err) {
        console.log(err);
        return null;
    }
}

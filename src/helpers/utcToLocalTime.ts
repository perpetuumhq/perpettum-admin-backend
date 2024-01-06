import moment from 'moment-timezone';

function utcToLocal(utcTimestamp: any, timeZone: any = "Asia/Kolkata") {
    const localTimestamp = moment.utc(utcTimestamp).tz(timeZone);
    return localTimestamp;
}

export default utcToLocal;

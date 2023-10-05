function localToUtc(localTimestamp: string) {
    const date = new Date(localTimestamp);
    const utcTimestamp = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
    return utcTimestamp;
}

export default localToUtc;

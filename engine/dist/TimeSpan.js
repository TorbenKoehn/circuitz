export default class TimeSpan {
    milliseconds;
    static millisecondsPerSecond = 1000;
    static millisecondsPerMinute = 1000 * 60;
    static millisecondsPerHour = 1000 * 60 * 60;
    static millisecondsPerDay = 1000 * 60 * 60 * 24;
    constructor(milliseconds) {
        this.milliseconds = milliseconds;
    }
    get seconds() {
        return this.milliseconds / TimeSpan.millisecondsPerSecond;
    }
    get minutes() {
        return this.milliseconds / TimeSpan.millisecondsPerMinute;
    }
    get hours() {
        return this.milliseconds / TimeSpan.millisecondsPerHour;
    }
    get days() {
        return this.milliseconds / TimeSpan.millisecondsPerDay;
    }
    static of(milliseconds) {
        return new TimeSpan(milliseconds);
    }
    static ofSeconds(seconds) {
        return new TimeSpan(seconds * TimeSpan.millisecondsPerSecond);
    }
    static ofMinutes(minutes) {
        return new TimeSpan(minutes * TimeSpan.millisecondsPerMinute);
    }
    static ofHours(hours) {
        return new TimeSpan(hours * TimeSpan.millisecondsPerHour);
    }
    static ofDays(days) {
        return new TimeSpan(days * TimeSpan.millisecondsPerDay);
    }
}

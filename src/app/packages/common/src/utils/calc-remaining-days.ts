export function calcRemainingDays(expDate: any): number {
    /*...
        1:  tomorrow
        0:  today (before the midnight)
        -1: already expired
 ...*/
    let diffInMs = Date.parse(expDate) - new Date().getTime();

    let daysLeft = Math.floor(diffInMs / 1000 / 60 / 60 / 24);

    if (daysLeft < 0) {
        // already expired
        return daysLeft;
    }

    let residualInMs = diffInMs - (daysLeft * 1000 * 60 * 60 * 24);

    let dayOfMonth = new Date().getDate();
    let dayOfMonthWithResidual = new Date(new Date().getTime() + residualInMs).getDate();

    if (dayOfMonth !== dayOfMonthWithResidual) {
        // expires after the midnight, add one day on existing value
        daysLeft++;
    }

    return daysLeft;
}

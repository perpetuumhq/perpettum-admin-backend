import { COL } from "../constants/const";
import { asyncForEach } from "./asyncForEach";

interface notificationPayload {
    db: any;
    to: string[];
    from: string;
    type: string;
    data?: any;
    notToShow?: boolean;
}


export default async function notificationSet(payload: notificationPayload) {
    const notificationRef = await payload.db.ref(`${COL.notification}`);
    const notificationsToSave = [...payload.to]?.map((to: string) => {
        return {
            to,
            from: payload.from,
            type: payload.type,
            data: payload.data,
            ...(payload?.notToShow && { notToShow: payload.notToShow })
        }
    })
    await asyncForEach(notificationsToSave, async (notification: any) => {
        await notificationRef.push(notification);
    })
}
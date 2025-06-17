import { IOrderItems } from "@/interfaces";

export const getOrderTime = ({ orderItems } : { orderItems: IOrderItems[] }) => {
    let timeByDays: number = 17;
    for (const { timeToMake } of orderItems) {
        if (timeToMake) {
            timeByDays = Math.max(timeByDays, timeToMake)
        }
    }
    return timeByDays;
}
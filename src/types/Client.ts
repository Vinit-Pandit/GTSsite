import { PaymentTypes } from "./PaymentTypes"

export default interface Client {
    siteName: string,
    clientName: string,
    siteBill: number,
    paymentType: PaymentTypes,
    paymentRemaining: number,
    remarks?: string,
    driveLink?: string,
    mobileNumber?: string,
    address?: string,
    architectureOrPMC?: string,
    date: string
}
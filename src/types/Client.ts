import { PaymentTypes } from "./PaymentTypes"

export default interface Client {
    siteName: string,
    clientName: string,
    mobileNumberOraddress?: string,
    siteBill: number,
    paymentType: PaymentTypes,
    paymentRemaining: number,
    remarks?: string,
    paymentDoneBy?: string,
    documentLinkTitle?: string,
    documentDriveLink?: string,
    mobileNumber?: string,
    address?: string,
    architectureOrPMC?: string,
    date: string
}
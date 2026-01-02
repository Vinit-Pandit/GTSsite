import { PaymentTypes } from "./PaymentTypes"

export default interface Karigar {
    siteName: string,
    karigarName: string,
    karigarSiteBill: number,
    paymentType: PaymentTypes,
    referenceOrChequeNumber: string,
    bankName?: string,
    paymentAmount: number,
    paymentDate: string,
    remainingAmount: number,
    paymentGivenBy: string,
    documentLinkTitle? : string,
    documentDriveLink? : string
}
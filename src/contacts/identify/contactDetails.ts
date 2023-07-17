import { Contact } from "..";
import DatabaseConnection from "../../database";
import makeFindSecondaryContacts from "../findSecondaryContacts";

export interface ContactSummary {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}

export default function makeContactSummaryFetcher(databaseConnection: DatabaseConnection) {
    const findSecondaryContacts = makeFindSecondaryContacts(databaseConnection)

    return async function (primaryContact: Contact) : Promise<ContactSummary> {
        const secondaryContacts = await findSecondaryContacts(primaryContact.id ?? 0)

        const emails = new Set<string>([])
        const phoneNumbers = new Set<string>([])
        const addDetails = ({ phoneNumber, email }: { phoneNumber?: string, email?: string }) => {
            if (phoneNumber) {
                phoneNumbers.add(phoneNumber)
            }

            if (email) {
                emails.add(email)
            }
        }

        const secondaryContactIds: number[] = []
        for (let contact of secondaryContacts) {
            addDetails(contact)
            secondaryContactIds.push(contact.id)
        }
        addDetails(primaryContact)

        return Promise.resolve({
            primaryContactId: primaryContact.id || 0,
            emails: [...emails],
            phoneNumbers: [...phoneNumbers],
            secondaryContactIds,
        })
    }
}



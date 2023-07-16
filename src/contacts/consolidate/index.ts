import { Contact, LinkPrecedence } from "..";
import DatabaseConnection from "../../database";
import makeContactAdder, { NewContact } from "../addContact";
import makeFindPrimaryContactByEmail from "../findContactByEmail";
import makeFindPrimaryContactByPhone from "../findContactByPhone";
import makeFindSecondaryContacts from "../findSecondaryContacts";
import makeMergeContacts from "../mergeContacts";


export interface ConsolidationRequest {
    email?: string;
    phoneNumber?: string;
}

interface ContactResponse {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}

export default function makeContactIdentifier(databaseConnection: DatabaseConnection) {
    const findByPhone = makeFindPrimaryContactByPhone(databaseConnection)
    const findByEmail = makeFindPrimaryContactByEmail(databaseConnection)

    const addContact = makeContactAdder(databaseConnection)
    const mergeContacts = makeMergeContacts(databaseConnection)
    const findSecondaryContacts = makeFindSecondaryContacts(databaseConnection)

    return async function identify(contact: ConsolidationRequest): Promise<ContactResponse> {
        const [contact1, contact2] = await Promise.all([
            contact.phoneNumber ? findByPhone(contact.phoneNumber) : Promise.resolve(null),
            contact.email ? findByEmail(contact.email) : Promise.resolve(null)
        ])

        if (!contact1 && !contact2) {
            const newId = await addContact(contact)
            return {
                primaryContactId: newId,
                emails: [contact.email ?? ""],
                phoneNumbers: [contact.phoneNumber ?? ""],
                secondaryContactIds: []
            }
        }

        let primaryContactId: number = contact1?.id || contact2?.id || 0
        if (!contact1 || !contact2) {
            const newContact: NewContact = {
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                linkedId: contact2?.id || contact1?.id,
                linkPrecedence: LinkPrecedence.secondary,
            }

            await addContact(newContact)
        } else if (contact1.id != contact2.id) {
            //merge contacts
            let contactId1 = contact1?.id as number
            let contactId2 = contact2?.id as number

            primaryContactId = await mergeContacts(contactId1, contactId2)
        }

        const secondaryContacts = await findSecondaryContacts(primaryContactId)
        const emails: string[] = []
        const phoneNumbers: string[] = []
        const secondaryContactIds: number[] = []

        for (let contact of secondaryContacts) {
            if (contact.email) {
                emails.push(contact.email)
            }

            if (contact.phoneNumber) {
                phoneNumbers.push(contact.phoneNumber)
            }

            secondaryContactIds.push(contact.id)
        }

        return Promise.resolve({
            primaryContactId,
            emails,
            phoneNumbers,
            secondaryContactIds,
        })
    }
}

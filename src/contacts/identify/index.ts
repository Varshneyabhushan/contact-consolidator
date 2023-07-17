import { Contact, LinkPrecedence } from "..";
import DatabaseConnection from "../../database";
import makeContactAdder, { NewContact } from "../addContact";
import makeFindPrimaryContactByEmail from "../findContactByEmail";
import makeFindPrimaryContactByPhone from "../findContactByPhone";
import makeMergeContacts from "../mergeContacts";
import makeContactSummaryFetcher, { ContactSummary } from "./contactDetails";


export interface ConsolidationRequest {
    email?: string;
    phoneNumber?: string;
}

export default function makeContactIdentifier(databaseConnection: DatabaseConnection) {
    const findByPhone = makeFindPrimaryContactByPhone(databaseConnection)
    const findByEmail = makeFindPrimaryContactByEmail(databaseConnection)

    const addContact = makeContactAdder(databaseConnection)
    const mergeContacts = makeMergeContacts(databaseConnection)

    const getContactSummary = makeContactSummaryFetcher(databaseConnection)

    return async function identify(contact: ConsolidationRequest): Promise<ContactSummary> {
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

        let primaryContact = contact1 || contact2 as Contact
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

            let contactId = await mergeContacts(contactId1, contactId2)
            primaryContact = (contactId == contactId1) ? contact1 : contact2
        }

        return getContactSummary(primaryContact)
    }
}

import { LinkPrecedence, PrimaryContact } from "..";
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
    const consolidate = makeConsolidateContacts(databaseConnection)

    const getContactSummary = makeContactSummaryFetcher(databaseConnection)

    return async function identify(contact: ConsolidationRequest): Promise<ContactSummary> {
        const [contact1, contact2] = await Promise.all([
            contact.phoneNumber ? findByPhone(contact.phoneNumber) : Promise.resolve(undefined),
            contact.email ? findByEmail(contact.email) : Promise.resolve(undefined)
        ])

        //create primaryContact
        if (!contact1 && !contact2) {
            const newId = await addContact(contact)
            return {
                primaryContactId: newId,
                emails: [contact.email ?? ""],
                phoneNumbers: [contact.phoneNumber ?? ""],
                secondaryContactIds: []
            }
        }

        /**
        * if one of the primaryContact doesn't exist and we want to add,
        * both of the email, phoneNumber should exist
        */
        if (!contact.phoneNumber || !contact.email) {
            const primaryContact = contact1 || contact2 as PrimaryContact
            return getContactSummary(primaryContact)
        }

        let primaryContact = await consolidate(contact1, contact2, contact)
        return getContactSummary(primaryContact)
    }
}

function makeConsolidateContacts(databaseConnection: DatabaseConnection) {

    const addContact = makeContactAdder(databaseConnection)
    const mergeContacts = makeMergeContacts(databaseConnection)

    return async function consolidate(
        primaryContact1: PrimaryContact | undefined,
        primaryContact2: PrimaryContact | undefined,
        newContact: ConsolidationRequest,
    ): Promise<PrimaryContact> {
        if (!primaryContact1 && !primaryContact2) {
            return Promise.reject("both are invalid")
        }

        if (!primaryContact1 || !primaryContact2) {
            const primaryContact = primaryContact1 || primaryContact2 as PrimaryContact
            const addingContact: NewContact = {
                email: newContact.email,
                phoneNumber: newContact.phoneNumber,
                linkedId: primaryContact1?.id || primaryContact2?.id,
                linkPrecedence: LinkPrecedence.secondary,
            }

            await addContact(addingContact)
            return primaryContact
        }

        if (primaryContact1.id == primaryContact2.id) {
            return primaryContact1
        }

        //merge contacts
        let contactId = await mergeContacts(primaryContact1.id, primaryContact2.id)
        if (contactId == primaryContact1.id) {
            return primaryContact1
        }

        return primaryContact2
    }
}
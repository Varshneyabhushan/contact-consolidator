import { Contact, ContactsTable, LinkPrecedence } from "..";
import DatabaseConnection from "../../database";

export interface NewContact {
    email?: string;
    phoneNumber?: string;
    linkedId?: number;
    linkPrecedence?: LinkPrecedence;
}

export default function makeContactAdder(connection: DatabaseConnection) {
    return function addContact(newContact: NewContact) {
        const timeNow = new Date()

        return connection.insert(ContactsTable, {
            email: newContact.email,
            phoneNumber: newContact.phoneNumber,
            linkedId: newContact.linkedId,
            linkPrecedence: newContact.linkPrecedence ?? LinkPrecedence.primary,
            createdAt: timeNow,
            updatedAt: timeNow,
        } as Contact)
    }
}
import { Contact, ContactsTable, LinkPrecedence } from "..";
import DatabaseConnection from "../../database";

interface NewContact {
    phoneNumber?: string;
    email?: string;
}

export default function makeContactAdder(connection: DatabaseConnection) {
    return function addPrimaryContact(newContact: NewContact) {
        const timeNow = new Date()

        return connection.insert(ContactsTable, {
            email: newContact.email,
            phoneNumber: newContact.phoneNumber,
            linkPrecedence : LinkPrecedence.primary,
            createdAt: timeNow,
            updatedAt: timeNow,
        } as Contact)
    }
}
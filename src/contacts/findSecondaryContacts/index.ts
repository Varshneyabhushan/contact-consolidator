import { ContactsTable } from "..";
import DatabaseConnection from "../../database";

interface ChildContact {
    id: number;
    email?: string;
    phoneNumber?: string;
}

export default function makeFindSecondaryContacts(databaseConnection: DatabaseConnection) {
    return function findSecondaryContacts(contactId: number): Promise<ChildContact[]> {
        return databaseConnection.find(ContactsTable, { linkedId : contactId })
    }
}
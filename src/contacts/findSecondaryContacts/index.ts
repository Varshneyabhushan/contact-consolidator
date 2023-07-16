import DatabaseConnection from "../../database";

interface ChildContact {
    id: number;
    email?: string;
    phoneNumber?: string;
}

export default function makeFindSecondaryContacts(databaseConnection: DatabaseConnection) {
    return function findSecondaryContacts(contactId: number): Promise<ChildContact[]> {
        return Promise.reject("not yet implemented")
    }
}
import { ContactsTable, LinkPrecedence } from "..";
import DatabaseConnection from "../../database";

export default function makeMergeContacts(databaseConnection: DatabaseConnection) {
    return async function (contact1: number, contact2: number): Promise<number> {
        return databaseConnection.query(
            `UPDATE ${ContactsTable} SET linkedId=${contact1}, linkPrecedence='${LinkPrecedence.secondary}' WHERE id=${contact2} OR linkedId=${contact2}`,
        )
        .then(() => contact1)
    }
}
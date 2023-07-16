import DatabaseConnection from "../../database";

export default function makeMergeContacts(databaseConnection : DatabaseConnection) {
    return async function(contact1 : number, contact2 : number) : Promise<number> {
        return Promise.reject('not yet implemented')
    }
}
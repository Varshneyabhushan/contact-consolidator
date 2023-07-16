import DatabaseConnection from "../../database";


export interface ConsolidationRequest {
    email ?: string;
    phoneNumber ?: string;
}

interface ContactResponse {
    primaryContactId : number;
    emails : string[];
    phoneNumbers : string[];
    secondaryContactIds : number[];
}

export default function makeConsolidator(databaseConnection : DatabaseConnection) {
    return function consolidate(contact : ConsolidationRequest) : Promise<ContactResponse> {
        return Promise.resolve({
            primaryContactId : 1,
            emails : [contact.email ?? ""],
            phoneNumbers : [contact.phoneNumber ?? ""],
            secondaryContactIds : [1,2]
        })
    }
}



export interface ConsolidationRequest {
    email : string;
    phoneNumber : string;
}

interface Contact {
    primaryContactId : number;
    emails : string[];
    phoneNumbers : string[];
    secondaryContactIds : number[];
}

export default function makeConsolidator() {
    return function consolidate(contact : ConsolidationRequest) : Promise<Contact> {
        return Promise.resolve({
            primaryContactId : 1,
            emails : [contact.email],
            phoneNumbers : [contact.phoneNumber],
            secondaryContactIds : [1,2]
        })
    }
}

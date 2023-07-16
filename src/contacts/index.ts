import DatabaseConnection from "../database";

const contactsColumns = `
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence ENUM('secondary', 'primary'),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    deletedAt DATETIME
`

enum LinkPrecedence {
    primary = "primary",
    secondary = "secondary"
}

export interface Contact {
    id ?: number;
    phoneNumber ?: string;
    email ?: string;
    linkedId ?: number;
    linkPrecedence : LinkPrecedence;
    createdAt : Date;
    updatedAt : Date;
    deletedAt ?: Date;
}

export const ContactsTable = "contacts"

export default function initContacts(database : DatabaseConnection) {
    database.createTableIfNotExists(ContactsTable, contactsColumns)
}
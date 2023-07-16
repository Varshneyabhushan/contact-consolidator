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
export default function initContacts(database : DatabaseConnection) {
    database.createTableIfNotExists("contacts", contactsColumns)
}
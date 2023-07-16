import { Contact, ContactsTable } from "..";
import DatabaseConnection from "../../database";

const procedureName = "FindPrimaryContactByEmail"
const createProcedure = `
CREATE PROCEDURE IF NOT EXISTS ${procedureName} (IN emailToFind VARCHAR(255))
BEGIN
  DECLARE _linkedId INT;
  SET _linkedId = (SELECT linkedId FROM ${ContactsTable} WHERE email = emailToFind);

  WHILE _linkedId IS NOT NULL DO
    SET _linkedId = (SELECT linkedId FROM contacts WHERE id = _linkedId);
  END WHILE;

  SELECT * FROM contacts WHERE id = _linkedId;
END;
`

export default function makeFindContactByEmail(databaseConnection : DatabaseConnection) {

    const ready = databaseConnection.query(createProcedure)

    return function(email : string) : Promise<Contact> {
        return ready.then(
            () => databaseConnection.query(`CALL ${procedureName}('${email}')`) as Promise<Contact[]>
        )
        .then(result => result[0] as unknown as Contact[])
        .then(contacts => contacts[0])
    }
}
import { ContactsTable, PrimaryContact } from "..";
import DatabaseConnection from "../../database";

const procedureName = "FindPrimaryContactByPhoneNumber"
const createProcedure = `
CREATE PROCEDURE IF NOT EXISTS ${procedureName} (IN phoneNumberToFind VARCHAR(255))
BEGIN
  DECLARE current INT;
  DECLARE next INT;
  
  SELECT id, linkedId INTO current, next FROM ${ContactsTable} WHERE phoneNumber = phoneNumberToFind ORDER BY id LIMIT 1;
  
  WHILE next IS NOT NULL DO
    SET current = next;
    SET next = (SELECT linkedId FROM ${ContactsTable} WHERE id = next);
  END WHILE;
  
  SELECT * FROM ${ContactsTable} WHERE id = current;
END;
`

export type PrimaryContactFinderResult = [PrimaryContact[], any]

export default function makeFindPrimaryContactByPhone(databaseConnection : DatabaseConnection) {

    const ready = databaseConnection.query(createProcedure)

    return function(phoneNumber : string) {
        return ready.then(
            () => databaseConnection.query(`CALL ${procedureName}('${phoneNumber}')`) as Promise<PrimaryContactFinderResult>
        )
        .then((result) => result[0])
        .then(contacts => contacts[0])
    }
}
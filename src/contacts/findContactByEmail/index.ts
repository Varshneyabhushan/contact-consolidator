import { ContactsTable, PrimaryContact } from "..";
import DatabaseConnection from "../../database";
import { PrimaryContactFinderResult } from "../findContactByPhone";

const procedureName = "FindPrimaryContactByEmail"
const createProcedure = `
CREATE PROCEDURE IF NOT EXISTS ${procedureName} (IN emailToFind VARCHAR(255))
BEGIN
  DECLARE current INT;
  DECLARE next INT;
  
  SELECT id, linkedId INTO current, next FROM ${ContactsTable} WHERE email = emailToFind ORDER BY id LIMIT 1;
  
  WHILE next IS NOT NULL DO
    SET current = next;
    SET next = (SELECT linkedId FROM ${ContactsTable} WHERE id = next);
  END WHILE;
  
  SELECT * FROM ${ContactsTable} WHERE id = current;
END;
`

export default function makeFindPrimaryContactByEmail(databaseConnection: DatabaseConnection) {

  const ready = databaseConnection.query(createProcedure)

  return function (email: string) : Promise<PrimaryContact | undefined> {
    return ready.then(
      () => databaseConnection.query(`CALL ${procedureName}('${email}')`) as Promise<PrimaryContactFinderResult>
    )
      .then(result => result[0] as unknown as PrimaryContact[])
      .then(contacts => contacts[0])
  }
}
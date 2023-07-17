# contact-consolidator
api is available at https://contacts.bhushan.fun/identify 


## [Resume](https://static1.squarespace.com/static/61348fef18bf592751921431/t/62f56a3a8fd1f456674ab2a5/1660300481646/resume-12-08-2022.pdf)

===> [FIND THE RESUME HERE](https://static1.squarespace.com/static/61348fef18bf592751921431/t/62f56a3a8fd1f456674ab2a5/1660300481646/resume-12-08-2022.pdf) <====

my portfolio : https://me.bhushan.fun

linkedId : https://www.linkedin.com/in/varbhushan/

## About
this endpoint merges all the known contacts and idenfies the person.

Endpoint expects the payload of the type 

```typescript
interface ConsolidationRequest {
    email?: string;
    phoneNumber?: string;
}
```

Returns the body of type
```typescript
interface ContactSummary {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
}
```

## Algorithm
When a contact is sent in the payload, we find the primary contact that is attached to the phoneNumber, email
1. If both email and phoneNumber doesn't exist, we create a new primary contact
2. If one of email and phoneNumber exist, we create a secondary contact with the details from payload, and attach it to the primary contact
3. If two primary contacts are found, as we are searching on both email and phoneNumber,
 * If they are same, we need not do anything
 * If they are not same, merge them. Point all the children of the second contact and the second contact itself to the first contact. (there are alternatives for this step)


## TODOs
Due to the time constraints following things are left, unfixed
1. authentication is not implemented
2. endpoint doesn't work on HTTP
3. only one strategy of merging the contacts is implemented, while other strategies are possible based on requirement
4. unit tests are not implemented
5. Data validation is not done thoroughly
6. phoneNumber that is accepted is a simple string (even "null" is considered as a phoneNumber)
7. Endpoint is not highly available or scalable


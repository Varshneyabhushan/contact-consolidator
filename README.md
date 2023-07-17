# contact-consolidator
api is available at https://contacts.bhushan.fun/identify
my portfolio : https://me.bhushan.fun

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

## TODOs
Due to the time constraints following things are left, unfixed
1. endpoint doesn't work on HTTP
2. only one strategy of merging the contacts is implemented, while other strategies are possible based on requirement
3. unit tests are not implemented
4. Data validation is not done thoroughly
5. phoneNumber that is accepted is a simple string (even "null" is considered as a phoneNumber)
6. Endpoint is not highly available or scalable


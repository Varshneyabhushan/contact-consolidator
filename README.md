# contact-consolidator
api is available at https://contacts.bhushan.fun/identify 


## [Resume](https://static1.squarespace.com/static/61348fef18bf592751921431/t/62f56a3a8fd1f456674ab2a5/1660300481646/resume-12-08-2022.pdf)

===> [FIND THE RESUME HERE](https://static1.squarespace.com/static/61348fef18bf592751921431/t/62f56a3a8fd1f456674ab2a5/1660300481646/resume-12-08-2022.pdf) <====

my portfolio : https://me.bhushan.fun

linkedId : https://www.linkedin.com/in/varbhushan/

## How to start the application

### method #1

1. Install the node_modules dependencies, including dev dependencies
```
npm install
```

2. fill the required details in .env file. Use sample.env as template. Following describes what each variable does

```
* PORT => port of the application
* REQUESTS_PER_MINUTE => number of requests permitted per minute (rate limiting)
* HOST => host address of MySQL database
* USERNAME => username for the database
* PASSWORD => password for the database
* DATABASE => database's name
```

3. The repository is written in typescript. So, the code need to be builded to vanilla javascript first

```
npm run build
```

4. Now, vanilla javascript should be present in the `dist` folder, run the following command to start the application
```
npm start
```

### method #2

As the Dockerfile and docker-compose.yml is added, the application can be started in docker containers

1. install docker deamon in your computer, as per these instructions: __https://docs.docker.com/engine/install/__
2. fill the .env file as in the instructions above
3. run the following command and the application will start at the port specified in the .env file
```
docker compose up -d
```

Endpoint `/identify` will be exposed at the port specified in the .env file. For example, if the port is `3000`, endpoint will be `http://localhost:3000/identify`

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


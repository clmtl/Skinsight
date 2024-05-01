<div align="center"><img src="./logo.svg"></div>

<br />

<div align="center">An application to help recognise potentially dangerous moles and easily make contact with doctors and specialists.</div>

<br />

# Description

This application allows patients to take pictures of their suspicious moles. These pictures will be analysed by an AI that will decide if it it necessary to consult a specialist.

Appointments can be made through the applications, first with a generalist, then if necessary with a dermatlogist.

# Installing and running the application

This server-side (back-end) repository is built with the [Nest](https://github.com/nestjs/nest) framework and Typescript.

This application uses docker, so make sure it is installed and functionning on you engine.

Then, in this repository's teminal, use the following line. It will build and start the docker.

```bash
$ docker compose up --build
```

This application uses a Postgres database with TypeORM.
The docker will have an empty database running along with the back-end server.

The API is available here: http://localhost:3000/

# Rest API

## Swagger

Swagger is available for this application. It is reachable using the base link to the API : http://localhost:3000/

You can also find the information about the different routes used below.

---

## Authentication

### Registery
`POST /auth/sign-up`

```
Request Body :
{
	"email": "hello@mail.com",
	"password": "omedghbeskldf",
	"role": "patient",
	"first_name": "John",
	"last_name": "Doe",
	"phone_number": "0123456789",
	"birth_date": "2000-11-22"
}
```

### Login
`POST /auth/sign-in`

### Logout
`GET /auth/logout`
```
Request Body :
{
	"email": "hello@mail.com",
	"password": "omedghbeskldf"
}
```

---

## Users

### Find all users
`GET /users/all`

### Find all
`GET /users`

If the user is a patient, then this returns all doctors and dermatologists.
If the user is a doctor, then this returns all patients and dermatilogists.
If the user is a dermatilogist, then this returns all patients and doctors.

### Find one
`GET /users/:id`

### Update one
`PATCH /users/:id`
```
Request Body :
{
	"phone_number": "0123456789",
}
```

### Delete one
`DELETE /users/:id`

---

## Skin Images

This is for pictures of suspicious moles that will be analysed when created.

### Find one patient's skin images from patient account
`GET /skin-images`

### Find one patient's skin images from doctor or dermatologist account
`GET /skin-images/user/:id`

### Find one skin image
`GET /skin-images/:id`

### Create one skin image
`POST /skin-images`
```
Request Body :
{
	"image_path": "path"
}
```

## Documents

This is for all other documents that will not be analysed.

### Find one patient's documents from patient account
`GET /documents`

### Find one patient's documents from doctor or dermatologist account
`GET /documents/user/:id`

### Find one document
`GET /documents/:id`

### Create one document
`POST /documents`
```
Request Body :
{
	"document_name": "letter from doctor",
    "document_path": "path",
    "document_type": "pdf"
}
```

### Update one document
`PATCH /documents/:id`
```
Request Body :
{
	"document_name": "letter from dermatologist"
}
```

### Delete one document
`DELETE /documents/:id`

## Appointments

This is for administrative informations about appointments dermatologists (date, status...)

### Find patient's appointments from patient account
`GET /appointments`

### Find patient's appointments from doctor or dermatologist account
`GET /appointments/user/:id`

### Find one appointment
`GET /appointments/:id`

### Create one appointment
`POST /appointments`
```
Request Body :
{
	"patient_id": 1,
	"doctor_id": 2,
	"appointment_time": Date,
	"status": "scheduled"
}
```

### Update one appointment
`PATCH /appointments/:id`
```
Request Body :
{
	"status": "completed"
}
```

### Delete one appointment
`DELETE /appointments/:id`

## Consultations
This is for the details of the consultation.

### Find patient's consultations from patient account
`GET /consultations`

### Find patient's consultations from doctor or dermatologist account
`GET /consultations/user/:id`

### Find one appointment
`GET /consultations/:id`

### Create one appointment
`POST /consultations`
```
Request Body :
{
	"patient_id": 1,
	"doctor_id": 2,
	"consultation_date": Date,
	"pre_consultation": true,
	"notes" : "This is an optional note"
}
```

### Update one appointment
`PATCH /consultations/:id`
```
Request Body :
{
	"notes" : "This is an updated note"
}
```

### Delete one appointment
`DELETE /consultations/:id`

## Messages
This if for conversations between doctors and dermatologists

### Find all user's messages
`GET /messages`

### Find one message
`GET /messages/:id`

### Create one message
`POST /messages`
```
Request Body :
{
	"sender_id" : 1,
	"receiver_id": 2,
	"message_text": "This is the message"
}
```

### Find one conversations
`POST /messages/conversation`
> This request takes two user's ids and returns their conversation.
```
Request Body :
{
	"users" : [1, 2]
}
```

### Find user's conversations
`GET /messages/conversations`
> This request takes the connected user's id and return an array of objects. Each object contains both users in the conversation.

### Update one message
`PATCH /messages/:id`
```
Request Body :
{
	"message_text": "This is the updated message"
}
```

### Delete one message
`DELETE /messages/:id`
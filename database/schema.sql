set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";


CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"fullName" TEXT NOT NULL,
	"yearOfBirth" TEXT NOT NULL,
	"userName" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL UNIQUE,
	"gender" TEXT NOT NULL,
	"preference" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."events" (
	"eventId" serial NOT NULL,
	"userId" integer NOT NULL,
	"sport" TEXT NOT NULL,
	"date" TEXT NOT NULL,
	"time" TEXT NOT NULL,
	"eventName" TEXT NOT NULL,
  "note" TEXT NOT NULL,
  "participant" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
	CONSTRAINT "events_pk" PRIMARY KEY ("eventId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."comments" (
	"commentId" serial NOT NULL,
	"eventId" integer NOT NULL,
	"userId" integer NOT NULL,
	"comment" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
	CONSTRAINT "comments_pk" PRIMARY KEY ("commentId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."eventLocations" (
	"eventId" integer NOT NULL,
	"locationId" integer NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."locations" (
	"locationId" serial NOT NULL,
	"location" TEXT NOT NULL,
  "lat" NUMERIC NOT NULL,
  "lng" NUMERIC NOT NULL,
	CONSTRAINT "locations_pk" PRIMARY KEY ("locationId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."eventStatus" (
	"eventId" integer NOT NULL,
	"userId" integer NOT NULL,
	"responseStatus" BOOLEAN NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."messages" (
	"messageId" serial NOT NULL,
	"sender" integer NOT NULL,
	"receiver" integer NOT NULL,
	"message" TEXT NOT NULL,
	CONSTRAINT "messages_pk" PRIMARY KEY ("messageId")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "events" ADD CONSTRAINT "events_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("eventId") REFERENCES "events"("eventId");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "eventLocations" ADD CONSTRAINT "eventLocations_fk0" FOREIGN KEY ("eventId") REFERENCES "events"("eventId");
ALTER TABLE "eventLocations" ADD CONSTRAINT "eventLocations_fk1" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId");


ALTER TABLE "eventStatus" ADD CONSTRAINT "eventStatus_fk0" FOREIGN KEY ("eventId") REFERENCES "events"("eventId");
ALTER TABLE "eventStatus" ADD CONSTRAINT "eventStatus_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "messages" ADD CONSTRAINT "messages_fk0" FOREIGN KEY ("sender") REFERENCES "users"("userId");
ALTER TABLE "messages" ADD CONSTRAINT "messages_fk1" FOREIGN KEY ("receiver") REFERENCES "users"("userId");

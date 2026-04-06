# Facilities and Assets Catalogue - MongoDB Schema

Database: smart_campus_db
Collection: facilities

## JSON document structure

```json
{
  "_id": "ObjectId",
  "resourceId": "FAC-ROOM-001",
  "type": "ROOM",
  "nameOrModel": "Seminar Room A1",
  "capacity": 40,
  "location": "Engineering Building - Floor 2",
  "availabilityWindows": [
    "Mon-Fri 08:00-17:00",
    "Sat 09:00-13:00"
  ],
  "status": "ACTIVE"
}
```

## Indexes

1. Unique index on resourceId
   - Enforced by Spring Data annotation: @Indexed(unique = true)

## Enumerations

- type: ROOM, EQUIPMENT, LAB, MEETING_ROOM, LECTURE_HALL
- status: ACTIVE, OUT_OF_SERVICE

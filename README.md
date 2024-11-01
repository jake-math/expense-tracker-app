# Expense Tracker (Work In Progress)

The general purpose of this application is to allow individuals in a group to track expenses and determine how much each individual is owed. It uses email/password to authenticate the current user, allows users to create a group, add other users to that group, and add/view/edit/delete expenses in specific groups.

Technologies:

- React
- JavaScript
- Node.JS
- Firebase Authentication
- Firestore Database
- Github Pages

Database Structure:

`Expense`

```
{
  "id": "expenseId",
  "amount": 1,
  "date": "October 31, 2024 at 0:0:0 PM UTC",
  "description": "description",
  "groupId": "groupId",
  "owner": "userId"
}
```

`Group`

```
{
  "id": "groupId",
  "name": "groupName",
  "owner": "userId",
  "users": [
    "userId"
  ]
}
```

`User`

```
{
  "id": "userId",
  "email": "email",
  "name": "name",  "groups": [
    "groupId"
  ]
}
```

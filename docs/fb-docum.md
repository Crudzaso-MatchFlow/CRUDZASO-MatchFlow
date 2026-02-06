# Change log - subscriptions & plans (phase 1)

## change 1: db.josn extension for plans and subscriptions

### What was added
two new collections were added to the db.json:
- `plans`
- `subscriptions`
### Refactoring
The data base structure was extended.
### Filfes modified
- `db.json`
## change 2:

### what was added
connect fronted with `plans` and `subscriptions` collections.
Files added:
- pages/plans.html
- scripts/plans.js

## change 3:
### what was added
- validation logic to restric actions based on subs.
- candidate cannot reserve more profiles than their plans allowed.
- companies cannot create more jobs offer tha their plans....

### files modified
- scripts/matches.js
- scripts/jobOffers.js

## change 4:
### added
a click for the "match" btn was introduced
a validation step was added before creating a reservation:
- candidates are not already reserved
- candidates are not already assigned
### Why 
this change ensure all the reservation actions is controlled flow with validation rules applied

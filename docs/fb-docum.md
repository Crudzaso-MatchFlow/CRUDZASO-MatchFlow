# Change log - subscriptions & plans (phase 1)

## change 1: db.josn extension for plans and subscriptions

### What was added
two new collections were added to the db.json:
- `plans`
- `subscriptions`
### Refactoring
The data base structure was extended.
### Files modified
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
**1. reservation blocking integration**
a click for the "match" btn was introduced
a validation step was added before creating a reservation:
- candidates are not already reserved
- Jobs offer are not already assigned
**2. Reservation flow validation**
- Candidates cannot be reserved if they are already reserved or marked as unavailable.
- Job offers cannot be used if they already have an active match.
### Why 
**1**. this change ensure all the reservation actions is controleled flow with validation rules applied.
**2**. json-server does not enforce bussisnes rules.
- invalid matches
- missing relations
- Runtime erros caused by missing session data

## change 5:

### Added
**visual match btn blocking**
The "match" btn is now visually blocked when a candidate is not avlb:
- if open to work is false
- if the candidate is already reserved.
(plan based restriction)
bussisnes rules were applied...
- candidates cannot be reserved beyons the plan reservation limit.
- job offers cannot be created beyond the plan offer limit
- Match buttons are visually disabled when a candidate is already reserved (refactorized)

## change 6:

### Added
**sub expiration validation**
subs expiration is validated before allowing:
- candidate reservation
- job offer creation
**Job offer Creation Restriction**
logical validations prevents submitting offers beyond the allowed plan limits. 
the form is visually blocked when the user has no active sub...
job offer creation is now restricted by subscription status and plan limits.
**Plan Usage Counter**
subs view now displays real usage of plan limits on screen :p
### files modified
- `utils.js`
- `subscription.js`

## Change 7:

### Fix
- Adjust user used functions (localStorage...("user) / getCurrentUser() in .js).
- Normalize dates to ISO
- routes **from** import
### Files Modified
- `scripts/app.js`
- `scripts/candidate.js`
- `scripts/company.js`
- `scripts/creatorOffer.js`
- `scripts/login.js`
- `scripts/plans.js`
- `scripts/subscription.js`
- `scripts/utils.js`


## Change 8:

### Fix
**Invalid .json in currentUser storage**
- Correct jsON serialization when storing the logged user.
### refactor
- replace all localStorage... by the fucntion getCurrentUser()
### Files modified
- pages/createOffer.html
- pages/dashboard_user.html
- pages/subscription.html
- scripts/company.js
- scripts/login.js
- scripts/plans.js
- scripts/subscription.js

## Change 9

### Added
**Upgrade UI cards in plans & subscription**
- improve design and responsive for both pages
- cards improved too 


### Files modified
- `pages/plans.html`
- `pages/subscription.html`

## Change 10

### Added
**SweetAlert2**
implemented modular alerts.
- Integrated alerts of SweetAlert

### Files modified
- `utils.js`

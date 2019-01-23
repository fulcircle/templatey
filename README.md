# Templatey
### Demo e-mail templating using React, Flask and Jinja2

---

### To Run Locally

#### Backend
Backend is built with Python and Flask.  You will need python 3.7.2.

1. CD into the `backend` directory
1. Create a virtualenv with python 3.7.2 if needed
1. Run `pip install`
1. Fill in your SendGrid API key in `settings/api_key_defaults.py`
1. Set bash environmental variables:
    > `$ export FLASK_APP=app.py`<br>
    `$ export FLASK_ENV=development`<br>
    `$ export FLASK_DEBUG=1`<br>
1. Run flask server: `flask run`
1. API should now be accessible at: `http://localhost:5000` (it will only accept POST calls to `/api`)

#### Frontend
Frontend is built with React using Typescript and node-sass

1. cd into the `frontend` directory
1. Run `npm install` or `yarn install`
1. Run the development server: `npm run start`
1. Frontend should now be accessible at: `http://localhost:3000`

---

### Some Notes

#### Application state
* I only store state on the main `App` component and did not use React's `Context` or a library like redux for the application state.  This is mostly because there was really only one level of nesting for the App.
It was more convenient and quicker to store all the state in the main `App` component in this case.  
* If this project became more complex, or intended to expand from a MVP,
I would move all state into a redux store.


#### Validation

* Due to time, I only implemented front-end validation for the fields.  There are no real validation rules
on the backend.  If I had more time, I would add validation there too.
* I used a validation library called `class-validator` which allows you to annotate validation rules 
directly onto TypeScript class fields.  Once annotated, you can merely call the library's `validateSync` function
to validate the fields.  I then used these validation results to have the `ValidatableInput` component automatically renders
itself with errors, if any.
* I shared the App's validation errors via React's `Context` framework so that I didn't have to pass them down props to the heavily nested `ValidatableInput` component.



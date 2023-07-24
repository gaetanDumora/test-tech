# Validation API

This end point is used to store a promocode and subsequently validate a set of conditions.
If the conditions are validated, the endpoint returns an object:

```
{
  promocode_name: string,
  status: 'accepted',
  avantage: Object,
}
```

if not, it returns an object:

```
{
  promocode_name: string,
  status: 'accepted',
  avantage: Object,
  reson: string,
}
```

## Installation

Install packages:
`npm i`

Run the app in development mode:
`npm run dev`

Run test suite:
`npm run test`

## Usage

Run the app.

Register a promocode endpoint by making a POST at: `localhost:8080/promocode/register` with header "Content-type: application/json".

Verify promocode by making a POST of conditions at: `localhost:8080/promocode/validate` with header "Content-type: application/json".

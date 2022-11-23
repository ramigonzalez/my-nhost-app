# Build App
## Create react App from template
```
npx create-react-app my-nhost-app --template nhost-quickstart
```

## Nhost React SDK
```
npm install @nhost/react graphql
```

## Get Nhost instance
```
import { NhostClient, NhostReactProvider } from '@nhost/react'
```

## Config env variables REGION & SUBDOMAIN
```
REACT_APP_NHOST_SUBDOMAIN
REACT_APP_NHOST_REGION
```
----------------------------------------------
----------------------------------------------

# Authentication
- Use Authentication hooks for react to easily:
 - signUp
 - signIn
 - singOut

# Database

## Code config
Install Apollo GraphQL Client for interacting with GraphQL API
```
npm install @nhost/react-apollo @apollo/client
```

## Hasura config
Since Hasura has an *allow nothing by default policy*, and we haven't set any permissions yet, our GraphQL mutations would fail.
- Give permissions
- Restrict the user to read his own data only, specify a condition with the user's ID and the *X-Hasura-User-ID session* variable, which is passed with each requests.
# Points SDK

The Points SDK allows clients to issue points for their users based on off-chain actions. It provides a flexible way to reward users by interacting with a PostgreSQL database. This SDK includes endpoints for registering projects, initializing points clients, setting and getting points for specific addresses, and filtering points by event names.

## Features

- Register projects and generate API keys.
- Initialize points client with an API key and campaign ID.
- Set points for specific addresses.
- Update event details.
- Get event details.
- Get points for specific addresses.
- Get points for specific addresses filtered by event name.
- Store points data in a PostgreSQL database.

## Requirements

- Node.js
- PostgreSQL
- TypeScript

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-repo/points-sdk.git
    cd points-sdk
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up your PostgreSQL database and configure the connection in `src/db.ts`:

    ```typescript
    import { Pool, PoolConfig } from 'pg';

    const poolConfig: PoolConfig = {
      user: 'your_user',
      host: 'localhost',
      database: 'your_database',
      password: 'your_password',
      port: 5432,
    };

    export const pool = new Pool(poolConfig);
    ```

4. Create the necessary database tables:

    ```sql
    -- Create apikey_table
    CREATE TABLE apikey_table (
        api_key VARCHAR(24) NOT NULL UNIQUE
    );

    -- Create project_table
    CREATE TABLE project_table (
        api_key VARCHAR(24) NOT NULL,
        campaign_id VARCHAR(16) NOT NULL,
        UNIQUE (api_key, campaign_id),
        UNIQUE (api_key),
        FOREIGN KEY (api_key) REFERENCES apikey_table(api_key)
    );

    -- Create point_table
    CREATE TABLE point_table (
        api_key VARCHAR(24) NOT NULL,
        event_name VARCHAR NOT NULL,
        points INT NOT NULL CHECK (points > 0),
        address VARCHAR(42) NOT NULL,
        FOREIGN KEY (api_key) REFERENCES project_table(api_key)
    );

    -- Create event_table
    CREATE TABLE event_table (
        api_key VARCHAR(24) NOT NULL,
        event_name VARCHAR NOT NULL UNIQUE,
        timestamp BIGINT NOT NULL CHECK (timestamp > 0),
        metadata TEXT NOT NULL,
        FOREIGN KEY (api_key) REFERENCES project_table(api_key)
    );

    ```

## Usage

### Running the Server

Start the server:

```sh
npm run build
npm start
```

### Endpoints

1. Register for an API key:

```
POST /register
```

Response:

```
{
  "apiKey": "generated_api_key"
}
```
2. Initialize the project:
```
POST /initialize
```
Request Body:
```
{
  "apiKey": "your_api_key",
  "campaignId": "your_campaign_id"
}
```
Response:
```
{
  "apiKey": "your_api_key",
  "campaignId": "your_campaign_id"
}
```

3. Distribute points

```
POST /distribute
```

Headers:
```
Authorization: Bearer your_api_key
```

Request Body:
```
{
  "eventName": "event_name",
  "pointsData": {
    "points": 100,
    "address": "0x123456789abcdef"
  }
}
```

Response:
```
{
  "message": "Points distributed successfully"
}
```

4. Update Event Metadata

```
POST /update_event
```

Headers:
```
Authorization: Bearer your_api_key
```

Request Body:
```
{
  "eventName": "event_name",
  "eventData": {
    "timestamp": 100,
    "metadata": "Event's metadata"
  }
}
```

Response:
```
{
  "message": "Event updated successfully"
}
```

5. Get Event Metadata

```
GET /event/:event_name
```

Headers:
```
Authorization: Bearer your_api_key
```

Response:
```
[
    {
        "api_key": "DXaPANzG.N9pu.ac~I5vCMOX",
        "event_name": "test-event",
        "timestamp": "123",
        "metadata": "This is test event"
    }
]
```

6. Get points for an address

```
GET /points/:address
```

Headers:
```
Authorization: Bearer your_api_key
```

Response:
```
[
  {
    "id": 1,
    "apiKey": "your_api_key",
    "eventName": "event_name",
    "points": 100,
    "address": "0x123456789abcdef"
  }
]
```

7. Get points for an address filtered by event name

```
GET /points/:address/:eventName
```

Headers:
```
Authorization: Bearer your_api_key
```

Response:
```
[
  {
    "id": 1,
    "apiKey": "your_api_key",
    "eventName": "event_name",
    "points": 100,
    "address": "0x123456789abcdef"
  }
]
```

## Project Structure

`src/authMiddleware.ts`: Middleware for extracting API keys.

`src/db.ts`: Database configuration using PostgreSQL.

`PointsSDK`: SDK implementation with methods to register, initialize, distribute, and retrieve points.

`src/index.ts`: Express server setup with endpoints.

`src/migration.sql`: PostgreSQL table creation scripts.

## Postman API Document
[Absin API](https://www.postman.com/light-fury/workspace/chienhui-lee-s-public-workspace/collection/13850722-3ce2a0de-3c86-4fff-bf1a-3bde3f490fab)

## Contact

For any questions or feedback, please contact us at leech.developer@gmail.com.

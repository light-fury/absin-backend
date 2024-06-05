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

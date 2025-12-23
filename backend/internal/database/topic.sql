-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hash_password VARCHAR(255) NOT NULL
);

-- TOPICS TABLE
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_topics_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- TOPIC_PINS TABLE
CREATE TABLE topic_pins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,

    CONSTRAINT fk_topic_pins_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_topic_pins_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE,

    -- prevents a user from pinning the same topic multiple times
    CONSTRAINT unique_user_topic_pin UNIQUE (user_id, topic_id)
);



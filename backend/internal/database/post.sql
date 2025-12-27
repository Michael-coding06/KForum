CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    topic_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    created_by INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMPTZ,

    CONSTRAINT fk_posts_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_posts_topic
        FOREIGN KEY (topic_id)
        REFERENCES topics(id)
        ON DELETE CASCADE
);


CREATE TABLE post_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,

    CONSTRAINT fk_post_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_likes_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    -- prevents users from having multiple likes for one post
    CONSTRAINT unique_user_post_like UNIQUE (user_id, post_id)
);
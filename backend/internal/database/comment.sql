CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,

    comment VARCHAR(255) NOT NULL,
    parent_comment INTEGER DEFAULT NULL,

    created_by INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    edited BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at TIMESTAMPTZ,

    CONSTRAINT fk_comments_by_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_in_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_reply
        FOREIGN KEY (parent_comment)
        REFERENCES comments(id)
        ON DELETE SET NULL
);

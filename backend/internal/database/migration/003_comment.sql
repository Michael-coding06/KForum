CREATE TABLE IF NOT EXISTS comments (
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

CREATE TABLE IF NOT EXISTS comment_reacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    comment_id INTEGER NOT NULL,
    reaction INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_comment_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comment_likes_comment
        FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,

    -- prevents users from having multiple likes for one comment
    CONSTRAINT unique_user_comment_like UNIQUE (user_id, comment_id)
    CONSTRAINT reaction_vald CHECK (reaction IN (-1, 0, 1))
);
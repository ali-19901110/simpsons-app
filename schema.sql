DROP TABLE mytable;
CREATE TABLE IF NOT EXISTS mytable (
    id serial primary key,
    chart varchar(255),
    quote text,
    img varchar(255)
);
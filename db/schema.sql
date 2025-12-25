CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
	isbn VARCHAR(20),
	rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <=5),
	description TEXT,
	notes TEXT,
	cover TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('New','Good','Needs Repair')),
  availability TEXT NOT NULL CHECK (availability IN ('Free','In Use','Reserved')),
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maintenance_logs (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  serviced_at DATE NOT NULL,
  next_service_due DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Reserved','Active','Completed','Cancelled')) DEFAULT 'Reserved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_maintenance_item_id ON maintenance_logs(item_id);
CREATE INDEX idx_bookings_item_id ON bookings(item_id);
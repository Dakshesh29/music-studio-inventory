TRUNCATE bookings, maintenance_logs, items, categories RESTART IDENTITY CASCADE;


INSERT INTO categories (name, description) VALUES
('Guitars', 'Electric and acoustic guitars used in recording sessions'),
('Keyboards', 'Digital and analog keyboards, synthesizers, and pianos'),
('Drums', 'Acoustic drum kits, electronic drums, and percussion instruments'),
('Recording Equipment', 'Microphones, mixers, audio interfaces, and monitors');


INSERT INTO items (category_id, name, brand, condition, availability, notes, image_url) VALUES
(1, 'Fender Stratocaster', 'Fender', 'Good', 'Free', 'Classic electric guitar, well-maintained', 'https://example.com/images/fender-strat.jpg'),
(1, 'Gibson Les Paul', 'Gibson', 'New', 'In Use', 'Recently purchased, excellent condition', 'https://example.com/images/gibson-les-paul.jpg'),


(2, 'Roland Fantom', 'Roland', 'Good', 'Free', 'Workstation keyboard with weighted keys', 'https://example.com/images/roland-fantom.jpg'),
(2, 'Yamaha Montage', 'Yamaha', 'Needs Repair', 'Reserved', 'Broken pitch wheel, awaiting service', 'https://example.com/images/yamaha-montage.jpg'),


(3, 'Pearl Export Kit', 'Pearl', 'Good', 'Free', 'Standard 5-piece acoustic drum kit', 'https://example.com/images/pearl-export.jpg'),
(3, 'Roland V-Drums TD-27', 'Roland', 'Good', 'In Use', 'Electronic drum set for studio recording', 'https://example.com/images/roland-vdrums.jpg'),


(4, 'Shure SM7B Microphone', 'Shure', 'New', 'Free', 'Dynamic microphone, popular for vocals', 'https://example.com/images/shure-sm7b.jpg'),
(4, 'Focusrite Scarlett 18i20', 'Focusrite', 'Good', 'Free', 'Audio interface, 18 inputs, 20 outputs', 'https://example.com/images/focusrite.jpg');


INSERT INTO maintenance_logs (item_id, serviced_at, next_service_due, notes) VALUES
(1, '2024-06-01', '2025-06-01', 'General cleaning and setup'),
(2, '2025-01-15', '2026-01-15', 'Checked electronics and frets'),
(4, '2024-12-01', '2025-06-01', 'Pitch wheel repair scheduled'),
(6, '2024-11-10', '2025-05-10', 'Replaced mesh drum heads');


INSERT INTO bookings (item_id, user_name, start_time, end_time, status) VALUES
(1, 'Alice Johnson', '2025-08-20 10:00:00+00', '2025-08-20 14:00:00+00', 'Reserved'),
(2, 'Bob Smith', '2025-08-15 09:00:00+00', '2025-08-15 12:00:00+00', 'Completed'),
(4, 'Charlie Davis', '2025-08-18 13:00:00+00', '2025-08-18 16:00:00+00', 'Cancelled'),
(6, 'Diana Miller', '2025-08-22 15:00:00+00', '2025-08-22 18:00:00+00', 'Active');

-- Supabase Seed Data

-- Initial Seed Data
insert into public.address (address_line_1, address_line_2, city, state, zip_postal_code, country) values
('123 Main St', 'Apt 4B', 'Anytown', 'CA', '90210', 'USA'),
('456 Oak Ave', 'Suite 100', 'Otherville', 'NY', '10001', 'USA'),
('789 Pine Ln', null, 'Somewhere', 'TX', '73301', 'USA'),
('101 Elm St', 'Unit 2', 'Villageton', 'FL', '33101', 'USA'),
('222 Maple Dr', 'Bldg 5', 'Hamlet', 'GA', '30303', 'USA'),
('333 Birch Rd', null, 'Metropolis', 'IL', '60601', 'USA'),
('444 Cedar Ct', 'Floor 3', 'Boomtown', 'WA', '98101', 'USA'),
('555 Spruce Way', null, 'Riverside', 'AZ', '85001', 'USA'),
('666 Willow Row', 'Apt 1A', 'Hillside', 'CO', '80001', 'USA'),
('777 Poplar Blvd', 'Unit 12', 'Lakeview', 'MI', '48103', 'USA');

insert into public.profiles (id, first_name, last_name, email, phone, dob, country, is_customer, is_vendor) values
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John', 'Doe', 'john.doe@example.com', '+2348012345678', '1990-01-15', 'Nigeria', true, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Jane', 'Smith', 'jane.smith@example.com', '+2348023456789', '1985-05-20', 'Nigeria', true, false),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Peter', 'Jones', 'peter.jones@example.com', '+2348034567890', '1992-11-01', 'Nigeria', false, true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Alice', 'Brown', 'alice.brown@example.com', '+2348045678901', '1988-03-25', 'Nigeria', true, false),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Bob', 'White', 'bob.white@example.com', '+2348056789012', '1995-07-10', 'Nigeria', false, true),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Maria', 'Garcia', 'maria.garcia@example.com', '+34600112233', '1991-08-22', 'Spain', true, false),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Kenji', 'Tanaka', 'kenji.tanaka@example.com', '+819012345678', '1987-02-11', 'Japan', true, true),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Sophie', 'Dubois', 'sophie.dubois@example.com', '+33612345678', '1993-04-03', 'France', false, true),
('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Carlos', 'Silva', 'carlos.silva@example.com', '+5511987654321', '1980-12-30', 'Brazil', true, false),
('45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', 'Emily', 'Clark', 'emily.clark@example.com', '+447123456789', '1998-06-05', 'United Kingdom', true, true);

insert into public.categories(category_name) values ('Electronics'),
('Clothing'),
('Books'),
('Beauty Products'),
('Automobiles'),
('Video Games'),
('Home & Kitchen'),
('Toys & Games'),
('Health & Household'),
('Pet Supplies'),
('Sports & Outdoors'),
('Tools & Home Improvement'),
('Arts, Crafts & Sewing'),
('Baby'),
('Garden & Outdoor'),
('Musical Instruments'),
('Office Products'),
('Software'),
('Collectibles & Fine Art'),
('Industrial & Scientific'),
('Handmade');

insert into public.subcategories(category_id, subcategory_name) values ((select category_id from categories where category_name = 'Electronics'), 'Computers'),
((select category_id from categories where category_name = 'Electronics'), 'Smartphones'),
((select category_id from categories where category_name = 'Electronics'), 'Accessories'),
((select category_id from categories where category_name = 'Electronics'), 'Televisions & Home Theater'),
((select category_id from categories where category_name = 'Electronics'), 'Cameras & Photography'),
((select category_id from categories where category_name = 'Electronics'), 'Wearable Technology'),
((select category_id from categories where category_name = 'Clothing'), 'Women''s Fashion'),
((select category_id from categories where category_name = 'Clothing'), 'Men''s Fashion'),
((select category_id from categories where category_name = 'Clothing'), 'Kids'' Fashion'),
((select category_id from categories where category_name = 'Clothing'), 'Footwear'),
((select category_id from categories where category_name = 'Books'), 'Fiction'),
((select category_id from categories where category_name = 'Books'), 'Non-Fiction'),
((select category_id from categories where category_name = 'Books'), 'Children''s Books'),
((select category_id from categories where category_name = 'Beauty Products'), 'Skincare'),
((select category_id from categories where category_name = 'Beauty Products'), 'Makeup'),
((select category_id from categories where category_name = 'Beauty Products'), 'Haircare'),
((select category_id from categories where category_name = 'Automobiles'), 'Car Parts & Accessories'),
((select category_id from categories where category_name = 'Automobiles'), 'Motorcycles'),
((select category_id from categories where category_name = 'Video Games'), 'PC Games'),
((select category_id from categories where category_name = 'Video Games'), 'PlayStation Games'),
((select category_id from categories where category_name = 'Video Games'), 'Xbox Games'),
((select category_id from categories where category_name = 'Home & Kitchen'), 'Kitchen Appliances'),
((select category_id from categories where category_name = 'Home & Kitchen'), 'Home Decor'),
((select category_id from categories where category_name = 'Home & Kitchen'), 'Furniture'),
((select category_id from categories where category_name = 'Toys & Games'), 'Action Figures'),
((select category_id from categories where category_name = 'Toys & Games'), 'Board Games'),
((select category_id from categories where category_name = 'Health & Household'), 'Vitamins & Supplements'),
((select category_id from categories where category_name = 'Health & Household'), 'Household Cleaners'),
((select category_id from categories where category_name = 'Pet Supplies'), 'Dog Supplies'),
((select category_id from categories where category_name = 'Pet Supplies'), 'Cat Supplies'),
((select category_id from categories where category_name = 'Sports & Outdoors'), 'Fitness Equipment'),
((select category_id from categories where category_name = 'Sports & Outdoors'), 'Camping & Hiking'),
((select category_id from categories where category_name = 'Tools & Home Improvement'), 'Power Tools'),
((select category_id from categories where category_name = 'Tools & Home Improvement'), 'Hand Tools'),
((select category_id from categories where category_name = 'Arts, Crafts & Sewing'), 'Painting & Drawing'),
((select category_id from categories where category_name = 'Arts, Crafts & Sewing'), 'Sewing & Fabric'),
((select category_id from categories where category_name = 'Baby'), 'Diapering'),
((select category_id from categories where category_name = 'Baby'), 'Feeding'),
((select category_id from categories where category_name = 'Garden & Outdoor'), 'Gardening Tools'),
((select category_id from categories where category_name = 'Garden & Outdoor'), 'Outdoor Decor'),
((select category_id from categories where category_name = 'Musical Instruments'), 'Guitars'),
((select category_id from categories where category_name = 'Musical Instruments'), 'Keyboards'),
((select category_id from categories where category_name = 'Office Products'), 'Office Electronics'),
((select category_id from categories where category_name = 'Office Products'), 'Office Furniture'),
((select category_id from categories where category_name = 'Software'), 'Operating Systems'),
((select category_id from categories where category_name = 'Software'), 'Productivity Software'),
((select category_id from categories where category_name = 'Collectibles & Fine Art'), 'Coins & Paper Money'),
((select category_id from categories where category_name = 'Collectibles & Fine Art'), 'Stamps'),
((select category_id from categories where category_name = 'Industrial & Scientific'), 'Lab & Scientific Products'),
((select category_id from categories where category_name = 'Industrial & Scientific'), 'Safety & Security'),
((select category_id from categories where category_name = 'Handmade'), 'Handmade Jewelry'),
((select category_id from categories where category_name = 'Handmade'), 'Handmade Home Decor');

insert into public.stores (store_name, custom_domain, vendor_id, address_id) values
('John''s Gadgets', 'gadgets.example.com', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select address_id from address where address_line_1 = '123 Main St' limit 1)),
('Peter''s Picks', null, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select address_id from address where address_line_1 = '456 Oak Ave' limit 1)),
('Bob''s Bargains', 'bargains.example.com', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select address_id from address where address_line_1 = '789 Pine Ln' limit 1)),
('Kenji''s Tech', 'kenjitech.example.com', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select address_id from address where address_line_1 = '101 Elm St' limit 1)),
('Sophie''s Boutique', null, 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select address_id from address where address_line_1 = '222 Maple Dr' limit 1)),
('Emily''s Emporium', 'emilysemp.example.com', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select address_id from address where address_line_1 = '333 Birch Rd' limit 1)),
('Global Goods', 'globalgoods.example.com', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select address_id from address where address_line_1 = '444 Cedar Ct' limit 1)),
('Artisan Alley', null, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select address_id from address where address_line_1 = '555 Spruce Way' limit 1)),
('Tech Haven', 'techhaven.example.com', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select address_id from address where address_line_1 = '666 Willow Row' limit 1)),
('Fashion Forward', null, '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select address_id from address where address_line_1 = '777 Poplar Blvd' limit 1));

-- Insert initial app configuration
INSERT INTO public.app_config (config_key, config_value, description)
VALUES ('dam_folder_prefix', 'sellit-media/', 'The prefix/folder for all assets stored in the Digital Asset Manager (DAM).')
ON CONFLICT (config_key) DO NOTHING;

-- Products Seed Data
-- Fake data for products
insert into public.products (title, description, vendor_id, store_id, category_id, subcategory_id) values
('Laptop Pro X', '{"16GB RAM", "512GB SSD", "Intel i7"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Computers')),
('Smartphone Ultra', '{"6.7 inch display", "128GB storage", "Dual Camera"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Smartphones')),
('Wireless Headphones', '{"Noise Cancelling", "20-hour battery life"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Classic Leather Jacket', '{"Genuine Leather", "Black"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Men''s Fashion')),
('Fantasy Novel Set', '{"J.R.R. Tolkien", "Fantasy"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Books'), (select subcategory_id from subcategories where subcategory_name = 'Fiction')),
('Organic Skincare Kit', '{"Anti-aging", "Vitamin C", "Hyaluronic Acid"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Skincare')),
('Gaming PC', '{"AMD Ryzen 9", "NVIDIA RTX 3080"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Video Games'), (select subcategory_id from subcategories where subcategory_name = 'PC Games')),
('Smart Home Hub', '{"Alexa, Google Assistant", "Voice Control", "Automation"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('Plush Toy Bear', '{"Large", "Soft Plush"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Toys & Games'), (select subcategory_id from subcategories where subcategory_name = 'Action Figures')),
('Yoga Mat Eco-Friendly', '{"Natural Rubber", "6mm"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Fitness Equipment')),
-- New products for John''s Gadgets
('Smartwatch Series 7', '{"GPS", "Heart Rate Monitor"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Wearable Technology')),
('4K Smart TV 55"', '{"HDR", "Voice Control"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Televisions & Home Theater')),
('Gaming Mouse RGB', '{"Programmable Buttons", "High DPI"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Portable Bluetooth Speaker', '{"Waterproof", "10-hour playtime"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Digital Camera DSLR', '{"24MP", "4K Video"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Cameras & Photography')),
('Robot Vacuum Cleaner', '{"Smart Mapping", "App Control"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('Air Fryer XL', '{"5.8 Quart", "Digital Display"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('External SSD 1TB', '{"USB 3.1", "Fast Transfer"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Noise Cancelling Earbuds', '{"True Wireless", "Active Noise Cancellation"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Smart Light Bulbs 4-Pack', '{"Dimmable", "Color Changing"}', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (select store_id from stores where store_name = 'John''s Gadgets'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Home Decor')),
-- New products for Peter's Picks
('Women''s Summer Dress', '{"Floral Print", "Cotton"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion')),
('Men''s Casual Shirt', '{"Linen Blend", "Button-down"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Men''s Fashion')),
('Children''s Story Book', '{"Illustrated", "Ages 3-6"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Books'), (select subcategory_id from subcategories where subcategory_name = 'Children''s Books')),
('Sci-Fi Paperback Novel', '{"Dystopian", "Award-winning"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Books'), (select subcategory_id from subcategories where subcategory_name = 'Fiction')),
('Board Game Strategy', '{"Family Fun", "Ages 10+"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Toys & Games'), (select subcategory_id from subcategories where subcategory_name = 'Board Games')),
('Building Blocks Set', '{"Creative Play", "500 pieces"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Toys & Games'), (select subcategory_id from subcategories where subcategory_name = 'Action Figures')),
('Running Shoes Men''s', '{"Breathable Mesh", "Cushioned Sole"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Footwear')),
('Classic Literature Collection', '{"Hardcover", "Complete Works"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Books'), (select subcategory_id from subcategories where subcategory_name = 'Non-Fiction')),
('Kids'' Backpack Animal Design', '{"Durable", "Water-resistant"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Kids'' Fashion')),
('Puzzle 1000 Pieces', '{"Landscape Scene", "Challenging"}', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (select store_id from stores where store_name = 'Peter''s Picks'), (select category_id from categories where category_name = 'Toys & Games'), (select subcategory_id from subcategories where subcategory_name = 'Board Games')),
-- New products for Bob''s Bargains
('Vitamin D3 Supplements', '{"5000 IU", "120 Softgels"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Health & Household'), (select subcategory_id from subcategories where subcategory_name = 'Vitamins & Supplements')),
('All-Purpose Cleaner', '{"Eco-Friendly", "Lemon Scent"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Health & Household'), (select subcategory_id from subcategories where subcategory_name = 'Household Cleaners')),
('PS5 Game - Adventure', '{"Open World", "Single Player"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Video Games'), (select subcategory_id from subcategories where subcategory_name = 'PlayStation Games')),
('Xbox Series X Game - RPG', '{"Multiplayer", "Fantasy"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Video Games'), (select subcategory_id from subcategories where subcategory_name = 'Xbox Games')),
('Sunscreen SPF 50', '{"Water Resistant", "Non-Greasy"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Skincare')),
('Hair Dryer Professional', '{"Ionic Technology", "Fast Drying"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Haircare')),
('Camping Tent 2-Person', '{"Lightweight", "Easy Setup"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Camping & Hiking')),
('Dumbbell Set Adjustable', '{"5-50 lbs", "Compact Design"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Fitness Equipment')),
('Facial Cleansing Brush', '{"Deep Cleanse", "Rechargeable"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Skincare')),
('PC Gaming Headset', '{"Surround Sound", "Noise Cancelling Mic"}', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', (select store_id from stores where store_name = 'Bob''s Bargains'), (select category_id from categories where category_name = 'Video Games'), (select subcategory_id from subcategories where subcategory_name = 'PC Games')),
-- New products for Kenji''s Tech
('Curved Gaming Monitor', '{"144Hz", "27 inch"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Computers')),
('Wireless Keyboard and Mouse Combo', '{"Ergonomic", "Long Battery Life"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Office Products'), (select subcategory_id from subcategories where subcategory_name = 'Office Electronics')),
('Antivirus Software 1-Year', '{"Real-time Protection", "Multi-device"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Software'), (select subcategory_id from subcategories where subcategory_name = 'Productivity Software')),
('Operating System Home Edition', '{"Latest Version", "Digital License"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Software'), (select subcategory_id from subcategories where subcategory_name = 'Operating Systems')),
('Webcam Full HD', '{"1080p", "Built-in Mic"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Network Router Wi-Fi 6', '{"Dual Band", "High Speed"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Laser Printer Wireless', '{"Monochrome", "Fast Printing"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Office Products'), (select subcategory_id from subcategories where subcategory_name = 'Office Electronics')),
('Projector Mini Portable', '{"HD Ready", "HDMI Input"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Televisions & Home Theater')),
('Graphic Design Software', '{"Professional Tools", "Subscription"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Software'), (select subcategory_id from subcategories where subcategory_name = 'Productivity Software')),
('Ergonomic Office Chair', '{"Adjustable Lumbar", "Mesh Back"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Kenji''s Tech'), (select category_id from categories where category_name = 'Office Products'), (select subcategory_id from subcategories where subcategory_name = 'Office Furniture')),
-- New products for Sophie''s Boutique
('Evening Gown Elegant', '{"Silk Blend", "Floor Length"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion')),
('Men''s Dress Shoes', '{"Genuine Leather", "Oxford Style"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Footwear')),
('Luxury Perfume 100ml', '{"Floral Scent", "Long Lasting"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Makeup')),
('Handmade Silver Necklace', '{"Sterling Silver", "Unique Design"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Jewelry')),
('Artisanal Ceramic Vase', '{"Hand-painted", "Modern Design"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Home Decor')),
('Kids'' Winter Coat', '{"Waterproof", "Warm Lining"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Kids'' Fashion')),
('Premium Makeup Brush Set', '{"Synthetic Bristles", "12 Pieces"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Makeup')),
('Hand-knitted Scarf', '{"Merino Wool", "Soft Texture"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Home Decor')),
('Designer Handbag', '{"Genuine Leather", "Crossbody"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion')),
('Organic Lip Balm Set', '{"Natural Ingredients", "Moisturizing"}', 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', (select store_id from stores where store_name = 'Sophie''s Boutique'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Skincare')),
-- New products for Emily''s Emporium
('Coffee Maker Drip', '{"12-Cup Capacity", "Programmable"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('Outdoor Patio Set', '{"Rattan", "4-Piece"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Garden & Outdoor'), (select subcategory_id from subcategories where subcategory_name = 'Outdoor Decor')),
('Acrylic Paint Set', '{"24 Colors", "Non-toxic"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Painting & Drawing')),
('Sewing Machine Beginner', '{"Portable", "Multiple Stitches"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Sewing & Fabric')),
('Garden Hose Expandable', '{"50ft", "No-kink"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Garden & Outdoor'), (select subcategory_id from subcategories where subcategory_name = 'Gardening Tools')),
('Blender High-Speed', '{"Smoothie Maker", "Ice Crushing"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('Wall Art Canvas Print', '{"Abstract Design", "Large Size"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Home Decor')),
('Gardening Gloves Durable', '{"Leather Palm", "Breathable"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Garden & Outdoor'), (select subcategory_id from subcategories where subcategory_name = 'Gardening Tools')),
('Embroidery Kit Beginner', '{"Hoop, Thread, Fabric"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Sewing & Fabric')),
('Cookware Set Non-Stick', '{"10-Piece", "Dishwasher Safe"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Emily''s Emporium'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),

-- New products for Global Goods
('Travel Backpack 40L', '{"Waterproof", "Laptop Compartment"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Camping & Hiking')),
('Universal Power Adapter', '{"Worldwide Compatibility", "USB Ports"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Gourmet Coffee Beans 1lb', '{"Single Origin", "Medium Roast"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('World Map Wall Decal', '{"Peel & Stick", "Educational"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Home Decor')),
('Portable Water Filter', '{"Outdoor Use", "Emergency"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Camping & Hiking')),
('International Cookbook', '{"Recipes from Around the World", "Hardcover"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Books'), (select subcategory_id from subcategories where subcategory_name = 'Non-Fiction')),
('Yoga Blocks 2-Pack', '{"High Density Foam", "Support"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Sports & Outdoors'), (select subcategory_id from subcategories where subcategory_name = 'Fitness Equipment')),
('Digital Luggage Scale', '{"Accurate", "Compact"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Reusable Shopping Bags 5-Pack', '{"Foldable", "Durable"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Home & Kitchen'), (select subcategory_id from subcategories where subcategory_name = 'Kitchen Appliances')),
('Multi-tool Pocket Knife', '{"Stainless Steel", "15 Functions"}', '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where store_name = 'Global Goods'), (select category_id from categories where category_name = 'Tools & Home Improvement'), (select subcategory_id from subcategories where subcategory_name = 'Hand Tools')),

-- New products for Artisan Alley
('Hand-painted Ceramic Mug', '{"Unique Design", "Dishwasher Safe"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Home Decor')),
('Custom Engraved Wooden Sign', '{"Personalized", "Home Decor"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Home Decor')),
('Oil Painting Kit Advanced', '{"Canvas, Brushes, Paints"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Painting & Drawing')),
('Sculpting Clay Set', '{"Non-toxic", "Modeling Tools"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Painting & Drawing')),
('Vintage Coin Collection', '{"Rare Finds", "Certificate of Authenticity"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Collectibles & Fine Art'), (select subcategory_id from subcategories where subcategory_name = 'Coins & Paper Money')),
('Collectible Stamps Album', '{"Worldwide Stamps", "Historical"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Collectibles & Fine Art'), (select subcategory_id from subcategories where subcategory_name = 'Stamps')),
('Hand-stitched Leather Wallet', '{"Full Grain Leather", "Slim Design"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Jewelry')),
('Calligraphy Pen Set', '{"Ink, Nibs, Paper"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Painting & Drawing')),
('Hand-blown Glass Figurine', '{"Art Glass", "Decorative"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Handmade'), (select subcategory_id from subcategories where subcategory_name = 'Handmade Home Decor')),
('DIY Jewelry Making Kit', '{"Beads, Charms, Tools"}', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where store_name = 'Artisan Alley'), (select category_id from categories where category_name = 'Arts, Crafts & Sewing'), (select subcategory_id from subcategories where subcategory_name = 'Sewing & Fabric')),

-- New products for Tech Haven
('High-Performance Gaming Laptop', '{"RTX 4070", "1TB SSD"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Computers')),
('VR Headset Advanced', '{"Immersive Experience", "Wireless"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Wearable Technology')),
('Data Recovery Software', '{"Lost Files", "Easy to Use"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Software'), (select subcategory_id from subcategories where subcategory_name = 'Productivity Software')),
('Laboratory Microscope Digital', '{"1000x Magnification", "USB Output"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Industrial & Scientific'), (select subcategory_id from subcategories where subcategory_name = 'Lab & Scientific Products')),
('3D Printer Desktop', '{"High Precision", "Filament Included"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Industrial & Scientific'), (select subcategory_id from subcategories where subcategory_name = 'Lab & Scientific Products')),
('Smart Home Security Camera', '{"Motion Detection", "Night Vision"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Accessories')),
('Server Rack Cabinet', '{"12U", "Ventilated"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Industrial & Scientific'), (select subcategory_id from subcategories where subcategory_name = 'Safety & Security')),
('Professional Audio Interface', '{"USB-C", "Studio Quality"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Musical Instruments'), (select subcategory_id from subcategories where subcategory_name = 'Guitars')),
('Coding Bootcamp Course', '{"Online Access", "Full Stack"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Software'), (select subcategory_id from subcategories where subcategory_name = 'Productivity Software')),
('Drone with 4K Camera', '{"GPS Return", "Long Flight Time"}', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', (select store_id from stores where store_name = 'Tech Haven'), (select category_id from categories where category_name = 'Electronics'), (select subcategory_id from subcategories where subcategory_name = 'Cameras & Photography')),

-- New products for Fashion Forward
('Women''s Denim Jeans', '{"High-Waist", "Skinny Fit"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion')),
('Men''s Polo Shirt', '{"Cotton Pique", "Classic Fit"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Men''s Fashion')),
('Kids'' Rain Boots', '{"Waterproof", "Fun Design"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Kids'' Fashion')),
('Ankle Boots Women''s', '{"Leather", "Block Heel"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Footwear')),
('Matte Lipstick Set', '{"Long-lasting", "Variety Pack"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Makeup')),
('Hair Straightener Ceramic', '{"Fast Heat-up", "Adjustable Temp"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Haircare')),
('Unisex Sunglasses UV400', '{"Polarized Lenses", "Classic Style"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion')),
('Leather Belt Men''s', '{"Reversible", "Adjustable"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Men''s Fashion')),
('Body Lotion Hydrating', '{"Shea Butter", "Vanilla Scent"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Beauty Products'), (select subcategory_id from subcategories where subcategory_name = 'Skincare')),
('Fashion Scarf Silk Blend', '{"Large Square", "Versatile"}', '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00', (select store_id from stores where store_name = 'Fashion Forward'), (select category_id from categories where category_name = 'Clothing'), (select subcategory_id from subcategories where subcategory_name = 'Women''s Fashion'));

-- Pages & Sections Seed Data
-- Seed data for pages table
insert into public.pages (store_id, page_slug, page_title, page_type, seo_data) values
((select store_id from stores where store_name = 'John''s Gadgets'), 'home', 'Welcome to John''s Gadgets', 'homepage',  '{"meta_description": "Your one-stop shop for all electronic gadgets.", "canonical_url": "https://gadgets.example.com", "keywords": ["gadgets", "electronics", "tech"]}'),
((select store_id from stores where store_name = 'Peter''s Picks'), 'home', 'Peter''s Picks for the best products', 'homepage',  '{"meta_description": "Curated collection of the best products.", "canonical_url": "https://peterspicks.example.com", "keywords": ["curated", "products", "best picks"]}'),
((select store_id from stores where store_name = 'Bob''s Bargains'), 'home', 'Bob''s Bargains - Unbeatable prices', 'homepage',  '{"meta_description": "Find the best bargains on all products.", "canonical_url": "https://bargains.example.com", "keywords": ["bargains", "deals", "discounts"]}'),
((select store_id from stores where store_name = 'Kenji''s Tech'), 'home', 'Kenji''s Tech - The future of technology', 'homepage',  '{"meta_description": "The latest in tech and gadgets.", "canonical_url": "https://kenjitech.example.com", "keywords": ["tech", "gadgets", "future"]}'),
((select store_id from stores where store_name = 'Sophie''s Boutique'), 'home', 'Sophie''s Boutique - Unique fashion items', 'homepage',  '{"meta_description": "Unique and stylish fashion for everyone.", "canonical_url": "https://sophiesboutique.example.com", "keywords": ["fashion", "boutique", "style"]}'),
((select store_id from stores where store_name = 'Emily''s Emporium'), 'home', 'Emily''s Emporium of Wonders', 'homepage',  '{"meta_description": "An emporium of wonderful items.", "canonical_url": "https://emilysemp.example.com", "keywords": ["emporium", "wonders", "unique items"]}'),
((select store_id from stores where store_name = 'Global Goods'), 'home', 'Global Goods - Products from around the world', 'homepage',  '{"meta_description": "Sourced from around the world, just for you.", "canonical_url": "https://globalgoods.example.com", "keywords": ["global", "goods", "international"]}'),
((select store_id from stores where store_name = 'Artisan Alley'), 'home', 'Artisan Alley - Handcrafted goods', 'homepage',  '{"meta_description": "Beautifully handcrafted goods from local artisans.", "canonical_url": "https://artisanalley.example.com", "keywords": ["artisan", "handcrafted", "local"]}'),
((select store_id from stores where store_name = 'Tech Haven'), 'home', 'Tech Haven - Your sanctuary for tech', 'homepage',  '{"meta_description": "Your one-stop shop for all things tech.", "canonical_url": "https://techhaven.example.com", "keywords": ["tech", "haven", "electronics"]}'),
((select store_id from stores where store_name = 'Fashion Forward'), 'home', 'Fashion Forward - The latest trends', 'homepage',  '{"meta_description": "Stay ahead of the curve with the latest fashion trends.", "canonical_url": "https://fashionforward.example.com", "keywords": ["fashion", "trends", "style"]}');

-- Seed data for page_sections table
-- Sections for John's Gadgets
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Welcome to John''s Gadgets'), 'hero', 'Welcome to John''s Gadgets', '{"subtitle": "Your one-stop shop for all electronic gadgets."}', 1),
((select page_id from pages where page_title = 'Welcome to John''s Gadgets'), 'product_grid', 'Featured Products', '{"product_ids": [1, 2, 3]}', 2);

-- Sections for Peter's Picks
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Peter''s Picks for the best products'), 'hero', 'Peter''s Picks', '{"subtitle": "Curated collection of the best products."}', 1),
((select page_id from pages where page_title = 'Peter''s Picks for the best products'), 'testimonial_list', 'What our customers say', '{"testimonials": [{"name": "John Doe", "quote": "Great products!"}, {"name": "Jane Smith", "quote": "Amazing service!"}]}', 2);

-- Sections for Bob's Bargains
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Bob''s Bargains - Unbeatable prices'), 'text_block', 'About Us', '{"content": "We find the best bargains so you don''t have to."}', 1);

-- Sections for Kenji's Tech
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Kenji''s Tech - The future of technology'), 'hero', 'Kenji''s Tech', '{"subtitle": "The future of technology is here."}', 1);

-- Sections for Sophie's Boutique
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Sophie''s Boutique - Unique fashion items'), 'product_grid', 'New Arrivals', '{"product_ids": [4, 5, 6]}', 1);

-- Sections for Emily's Emporium
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Emily''s Emporium of Wonders'), 'hero', 'Emily''s Emporium', '{"subtitle": "A collection of wonderful items."}', 1);

-- Sections for Global Goods
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Global Goods - Products from around the world'), 'text_block', 'Our Mission', '{"content": "To bring the world to your doorstep."}', 1);

-- Sections for Artisan Alley
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Artisan Alley - Handcrafted goods'), 'product_grid', 'Our Artisans'' Work', '{"product_ids": [7, 8, 9]}', 1);

-- Sections for Tech Haven
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Tech Haven - Your sanctuary for tech'), 'hero', 'Tech Haven', '{"subtitle": "Your sanctuary for all things tech."}', 1);

-- Sections for Fashion Forward
insert into public.page_sections (page_id, section_type, section_title, section_data, sort_order) values
((select page_id from pages where page_title = 'Fashion Forward - The latest trends'), 'testimonial_list', 'Style Icons', '{"testimonials": [{"name": "Fashionista", "quote": "I love this store!"}]}', 1);

-- Product Variants Seed Data
-- Seed product_variants with a default variant for each product
insert into public.product_variants (product_id, sku, base_price)
select
  p.product_id,
  'THR-' || p.product_id,
  100000
from
  public.products p
where
  p.title not in (
    'Classic Leather Jacket',
    'Wireless Headphones',
    'Women''s Summer Dress',
    'Men''s Casual Shirt',
    'Running Shoes Men''s',
    'Ankle Boots Women''s',
    'Women''s Denim Jeans',
    'Men''s Polo Shirt',
    'Laptop Pro X',
    'Smartphone Ultra',
    'Organic Skincare Kit',
    'Gaming PC',
    'Smart Home Hub',
    'Plush Toy Bear',
    'Yoga Mat Eco-Friendly',
    'Smartwatch Series 7',
    '4K Smart TV 55"' ,
    'Gaming Mouse RGB',
    'Portable Bluetooth Speaker',
    'Digital Camera DSLR',
    'Robot Vacuum Cleaner',
    'Air Fryer XL',
    'External SSD 1TB',
    'Noise Cancelling Earbuds',
    'Smart Light Bulbs 4-Pack',
    'Children''s Story Book',
    'Sci-Fi Paperback Novel',
    'Board Game Strategy',
    'Building Blocks Set',
    'Classic Literature Collection',
    'Kids'' Backpack Animal Design',
    'Puzzle 1000 Pieces',
    'Vitamin D3 Supplements',
    'All-Purpose Cleaner',
    'PS5 Game - Adventure',
    'Xbox Series X Game - RPG',
    'Sunscreen SPF 50',
    'Hair Dryer Professional',
    'Camping Tent 2-Person',
    'Dumbbell Set Adjustable',
    'Facial Cleansing Brush',
    'PC Gaming Headset',
    'Curved Gaming Monitor',
    'Wireless Keyboard and Mouse Combo',
    'Antivirus Software 1-Year',
    'Operating System Home Edition',
    'Webcam Full HD',
    'Network Router Wi-Fi 6',
    'Laser Printer Wireless'
  );

-- Seed inventory for the default variants
insert into public.inventory (variant_id, quantity_change, reason)
select
  pv.variant_id,
  100, -- Default quantity
  'initial_stock'
from
  public.product_variants pv
  join public.products p on pv.product_id = p.product_id
where
  p.title not in (
    'Classic Leather Jacket',
    'Wireless Headphones',
    'Women''s Summer Dress',
    'Men''s Casual Shirt',
    'Running Shoes Men''s',
    'Ankle Boots Women''s',
    'Women''s Denim Jeans',
    'Men''s Polo Shirt',
    'Laptop Pro X',
    'Smartphone Ultra',
    'Organic Skincare Kit',
    'Gaming PC',
    'Smart Home Hub',
    'Plush Toy Bear',
    'Yoga Mat Eco-Friendly',
    'Smartwatch Series 7',
    '4K Smart TV 55"' ,
    'Gaming Mouse RGB',
    'Portable Bluetooth Speaker',
    'Digital Camera DSLR',
    'Robot Vacuum Cleaner',
    'Air Fryer XL',
    'External SSD 1TB',
    'Noise Cancelling Earbuds',
    'Smart Light Bulbs 4-Pack',
    'Children''s Story Book',
    'Sci-Fi Paperback Novel',
    'Board Game Strategy',
    'Building Blocks Set',
    'Classic Literature Collection',
    'Kids'' Backpack Animal Design',
    'Puzzle 1000 Pieces',
    'Vitamin D3 Supplements',
    'All-Purpose Cleaner',
    'PS5 Game - Adventure',
    'Xbox Series X Game - RPG',
    'Sunscreen SPF 50',
    'Hair Dryer Professional',
    'Camping Tent 2-Person',
    'Dumbbell Set Adjustable',
    'Facial Cleansing Brush',
    'PC Gaming Headset',
    'Curved Gaming Monitor',
    'Wireless Keyboard and Mouse Combo',
    'Antivirus Software 1-Year',
    'Operating System Home Edition',
    'Webcam Full HD',
    'Network Router Wi-Fi 6',
    'Laser Printer Wireless'
  );

-- Seed variants for Laser Printer Wireless
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Laser Printer Wireless';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['White', 'Black']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Network Router Wi-Fi 6
DO $$
DECLARE
    v_product_id int;
    v_option_id_speed int;
    speed_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Network Router Wi-Fi 6';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SPEED') RETURNING option_id INTO v_option_id_speed;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_speed, speed FROM unnest(array['AX1800', 'AX3000', 'AX5400']) as speed;

    -- Create variants and link them
    FOR speed_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_speed
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || speed_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 15, 'initial_stock');

        -- Link to speed value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_speed AND value = speed_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Webcam Full HD
DO $$
DECLARE
    v_product_id int;
    v_option_id_resolution int;
    resolution_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Webcam Full HD';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'RESOLUTION') RETURNING option_id INTO v_option_id_resolution;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_resolution, resolution FROM unnest(array['720p', '1080p']) as resolution;

    -- Create variants and link them
    FOR resolution_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_resolution
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || resolution_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to resolution value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_resolution AND value = resolution_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Wireless Keyboard and Mouse Combo
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Wireless Keyboard and Mouse Combo';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White', 'Silver']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Curved Gaming Monitor
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_refresh_rate int;
    size_value text;
    refresh_rate_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Curved Gaming Monitor';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'REFRESH_RATE') RETURNING option_id INTO v_option_id_refresh_rate;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['24 inch', '27 inch', '32 inch']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_refresh_rate, refresh_rate FROM unnest(array['144Hz', '240Hz']) as refresh_rate;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR refresh_rate_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_refresh_rate
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || refresh_rate_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to refresh_rate value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_refresh_rate AND value = refresh_rate_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for PC Gaming Headset
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'PC Gaming Headset';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'Red']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Facial Cleansing Brush
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Facial Cleansing Brush';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Pink', 'Blue', 'White']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Dumbbell Set Adjustable
DO $$
DECLARE
    v_product_id int;
    v_option_id_weight_range int;
    weight_range_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Dumbbell Set Adjustable';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'WEIGHT_RANGE') RETURNING option_id INTO v_option_id_weight_range;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_weight_range, weight_range FROM unnest(array['5-25 lbs', '5-50 lbs', '10-70 lbs']) as weight_range;

    -- Create variants and link them
    FOR weight_range_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_weight_range
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || weight_range_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

        -- Link to weight_range value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_weight_range AND value = weight_range_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Camping Tent 2-Person
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_capacity int;
    color_value text;
    capacity_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Camping Tent 2-Person';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'CAPACITY') RETURNING option_id INTO v_option_id_capacity;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Green', 'Blue', 'Orange']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_capacity, capacity FROM unnest(array['2-Person', '4-Person']) as capacity;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR capacity_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_capacity
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || capacity_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to capacity value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_capacity AND value = capacity_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Hair Dryer Professional
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Hair Dryer Professional';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White', 'Pink']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 25, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Sunscreen SPF 50
DO $$
DECLARE
    v_product_id int;
    v_option_id_volume int;
    volume_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Sunscreen SPF 50';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'VOLUME') RETURNING option_id INTO v_option_id_volume;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_volume, volume FROM unnest(array['50ml', '100ml', '200ml']) as volume;

    -- Create variants and link them
    FOR volume_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_volume
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || volume_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 30, 'initial_stock');

        -- Link to volume value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_volume AND value = volume_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for All-Purpose Cleaner
DO $$
DECLARE
    v_product_id int;
    v_option_id_scent int;
    scent_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'All-Purpose Cleaner';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SCENT') RETURNING option_id INTO v_option_id_scent;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_scent, scent FROM unnest(array['Lemon', 'Lavender', 'Unscented']) as scent;

    -- Create variants and link them
    FOR scent_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_scent
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || scent_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 40, 'initial_stock');

        -- Link to scent value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_scent AND value = scent_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Vitamin D3 Supplements
DO $$
DECLARE
    v_product_id int;
    v_option_id_count int;
    count_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Vitamin D3 Supplements';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COUNT') RETURNING option_id INTO v_option_id_count;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_count, count FROM unnest(array['60 Softgels', '120 Softgels', '240 Softgels']) as count;

    -- Create variants and link them
    FOR count_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_count
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || count_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 30, 'initial_stock');

        -- Link to count value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_count AND value = count_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Kids' Backpack Animal Design
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Kids'' Backpack Animal Design';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Blue', 'Pink', 'Green']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 25, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Smart Light Bulbs 4-Pack
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Smart Light Bulbs 4-Pack';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['White', 'Warm White', 'RGB']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Noise Cancelling Earbuds
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Noise Cancelling Earbuds';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 50, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for External SSD 1TB
DO $$
DECLARE
    v_product_id int;
    v_option_id_capacity int;
    capacity_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'External SSD 1TB';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'CAPACITY') RETURNING option_id INTO v_option_id_capacity;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_capacity, capacity FROM unnest(array['500GB', '1TB', '2TB']) as capacity;

    -- Create variants and link them
    FOR capacity_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_capacity
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || capacity_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 25, 'initial_stock');

        -- Link to capacity value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_capacity AND value = capacity_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Air Fryer XL
DO $$
DECLARE
    v_product_id int;
    v_option_id_capacity int;
    capacity_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Air Fryer XL';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'CAPACITY') RETURNING option_id INTO v_option_id_capacity;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_capacity, capacity FROM unnest(array['4 Quart', '5.8 Quart', '7 Quart']) as capacity;

    -- Create variants and link them
    FOR capacity_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_capacity
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || capacity_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to capacity value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_capacity AND value = capacity_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Robot Vacuum Cleaner
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Robot Vacuum Cleaner';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 15, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Digital Camera DSLR
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_megapixels int;
    color_value text;
    megapixels_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Digital Camera DSLR';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'MEGAPIXELS') RETURNING option_id INTO v_option_id_megapixels;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'Silver']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_megapixels, megapixels FROM unnest(array['20MP', '24MP', '30MP']) as megapixels;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR megapixels_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_megapixels
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || megapixels_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to megapixels value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_megapixels AND value = megapixels_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Portable Bluetooth Speaker
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Portable Bluetooth Speaker';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'Blue', 'Red']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 40, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Gaming Mouse RGB
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Gaming Mouse RGB';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White', 'Red']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 30, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for 4K Smart TV 55"
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_resolution int;
    size_value text;
    resolution_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = '4K Smart TV 55"' ;

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'RESOLUTION') RETURNING option_id INTO v_option_id_resolution;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['55"', '65"', '75"']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_resolution, resolution FROM unnest(array['4K UHD', '8K UHD']) as resolution;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR resolution_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_resolution
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || resolution_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 8, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to resolution value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_resolution AND value = resolution_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Smartwatch Series 7
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_size int;
    color_value text;
    size_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Smartwatch Series 7';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'Silver', 'Rose Gold']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['41mm', '45mm']) as size;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || size_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Yoga Mat Eco-Friendly
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_thickness int;
    color_value text;
    thickness_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Yoga Mat Eco-Friendly';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'THICKNESS') RETURNING option_id INTO v_option_id_thickness;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Blue', 'Green', 'Purple', 'Black']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_thickness, thickness FROM unnest(array['4mm', '6mm', '8mm']) as thickness;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR thickness_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_thickness
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || thickness_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 15, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to thickness value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_thickness AND value = thickness_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Smart Home Hub
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Smart Home Hub';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['White', 'Black', 'Grey']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Gaming PC
DO $$
DECLARE
    v_product_id int;
    v_option_id_ram int;
    v_option_id_storage int;
    ram_value text;
    storage_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Gaming PC';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'RAM') RETURNING option_id INTO v_option_id_ram;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'STORAGE') RETURNING option_id INTO v_option_id_storage;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_ram, ram FROM unnest(array['16GB', '32GB', '64GB']) as ram;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_storage, storage FROM unnest(array['512GB SSD', '1TB SSD', '2TB SSD']) as storage;

    -- Create variants and link them
    FOR ram_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_ram
    LOOP
        FOR storage_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_storage
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || ram_value || '-' || storage_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 5, 'initial_stock');

            -- Link to RAM value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_ram AND value = ram_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to storage value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_storage AND value = storage_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Organic Skincare Kit
DO $$
DECLARE
    v_product_id int;
    v_option_id_volume int;
    volume_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Organic Skincare Kit';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'VOLUME') RETURNING option_id INTO v_option_id_volume;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_volume, volume FROM unnest(array['30ml', '50ml', '100ml']) as volume;

    -- Create variants and link them
    FOR volume_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_volume
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || volume_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

        -- Link to volume value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_volume AND value = volume_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Smartphone Ultra
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_storage int;
    color_value text;
    storage_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Smartphone Ultra';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'STORAGE') RETURNING option_id INTO v_option_id_storage;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Black', 'White', 'Blue', 'Gold']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_storage, storage FROM unnest(array['128GB', '256GB', '512GB']) as storage;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR storage_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_storage
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || storage_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 15, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to storage value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_storage AND value = storage_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Laptop Pro X
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    v_option_id_storage int;
    color_value text;
    storage_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Laptop Pro X';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'STORAGE') RETURNING option_id INTO v_option_id_storage;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['Silver', 'Space Gray', 'Black']) as color;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_storage, storage FROM unnest(array['256GB', '512GB', '1TB']) as storage;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        FOR storage_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_storage
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value || '-' || storage_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 10, 'initial_stock');

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to storage value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_storage AND value = storage_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Classic Leather Jacket
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Classic Leather Jacket';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['S', 'M', 'L', 'XL']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['BLACK', 'BROWN', 'GREY']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 25, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Wireless Headphones
DO $$
DECLARE
    v_product_id int;
    v_option_id_color int;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Wireless Headphones';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['BLACK', 'WHITE', 'BLUE']) as color;

    -- Create variants and link them
    FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
    LOOP
        -- Insert variant
        INSERT INTO public.product_variants (product_id, sku, base_price)
        SELECT v_product_id, 'THR-' || v_product_id || '-' || color_value, 100000
        RETURNING variant_id INTO v_variant_id;

        -- Seed inventory
        INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 50, 'initial_stock');

        -- Link to color value
        SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
        INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
    END LOOP;
END $$;

-- Seed variants for Women's Summer Dress
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Women''s Summer Dress';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['S', 'M', 'L', 'XL']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['RED', 'BLUE', 'GREEN']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 30, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Men's Casual Shirt
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Men''s Casual Shirt';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['S', 'M', 'L', 'XL']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['WHITE', 'BLUE', 'BLACK']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 40, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Running Shoes Men's
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Running Shoes Men''s';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['8', '9', '10', '11', '12']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['BLACK', 'WHITE', 'RED']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 20, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Ankle Boots Women's
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Ankle Boots Women''s';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['6', '7', '8', '9']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['BLACK', 'BROWN']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 15, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Women's Denim Jeans
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Women''s Denim Jeans';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['26', '28', '30', '32']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['BLUE', 'BLACK']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 35, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Seed variants for Men's Polo Shirt
DO $$
DECLARE
    v_product_id int;
    v_option_id_size int;
    v_option_id_color int;
    size_value text;
    color_value text;
    v_variant_id int;
    v_value_id int;
BEGIN
    -- Get product_id
    SELECT product_id INTO v_product_id FROM public.products WHERE title = 'Men''s Polo Shirt';

    -- Insert options and get their IDs
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'SIZE') RETURNING option_id INTO v_option_id_size;
    INSERT INTO public.product_options (product_id, option_name) VALUES (v_product_id, 'COLOR') RETURNING option_id INTO v_option_id_color;

    -- Insert option values
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_size, size FROM unnest(array['S', 'M', 'L', 'XL']) as size;
    INSERT INTO public.product_option_values (option_id, value)
    SELECT v_option_id_color, color FROM unnest(array['RED', 'WHITE', 'NAVY']) as color;

    -- Create variants and link them
    FOR size_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_size
    LOOP
        FOR color_value IN SELECT value FROM public.product_option_values WHERE option_id = v_option_id_color
        LOOP
            -- Insert variant
            INSERT INTO public.product_variants (product_id, sku, base_price)
            SELECT v_product_id, 'THR-' || v_product_id || '-' || size_value || '-' || color_value, 100000
            FROM public.products WHERE product_id = v_product_id
            RETURNING variant_id INTO v_variant_id;

            -- Seed inventory
            INSERT INTO public.inventory (variant_id, quantity_change, reason) VALUES (v_variant_id, 50, 'initial_stock');

            -- Link to size value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_size AND value = size_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);

            -- Link to color value
            SELECT option_value_id INTO v_value_id FROM public.product_option_values WHERE option_id = v_option_id_color AND value = color_value;
            INSERT INTO public.variant_to_option_values (variant_id, variant_value_id) VALUES (v_variant_id, v_value_id);
        END LOOP;
    END LOOP;
END $$;

-- Insert into media and product_media_links for each variant
DO $$
DECLARE
    v_variant_record RECORD;
    v_media_id INT;
    v_filename TEXT;
    v_filepath TEXT;
    v_options_string TEXT;
    v_desc_string TEXT;
    v_dam_folder_prefix TEXT;
BEGIN
    -- Get the DAM folder prefix from the app_config table
    SELECT config_value INTO v_dam_folder_prefix FROM public.app_config WHERE config_key = 'dam_folder_prefix';

    FOR v_variant_record IN
        SELECT
            pv.variant_id,
            p.title,
            p.vendor_id,
            (
                SELECT STRING_AGG(pov.value, '_' ORDER BY po.option_name)
                FROM public.variant_to_option_values vtov
                JOIN public.product_option_values pov ON vtov.variant_value_id = pov.option_value_id
                JOIN public.product_options po ON pov.option_id = po.option_id
                WHERE vtov.variant_id = pv.variant_id
            ) as options
        FROM
            public.product_variants pv
        JOIN
            public.products p ON pv.product_id = p.product_id
    LOOP
        -- Sanitize title and options for filename
        v_filename := regexp_replace(v_variant_record.title, '[^a-zA-Z0-9_]+', '_', 'g');
        
        v_options_string := '';
        IF v_variant_record.options IS NOT NULL THEN
            v_options_string := '_' || regexp_replace(v_variant_record.options, '[^a-zA-Z0-9_]+', '_', 'g');
        END IF;

        v_desc_string := v_variant_record.title || ' ' || COALESCE(regexp_replace(v_variant_record.options, '_', ' ', 'g'), '');

        v_filename := v_filename || v_options_string || '.jpg';
        v_filepath := v_dam_folder_prefix || 'products/' || v_filename;

        -- Insert into media table
        INSERT INTO public.media (filename, filepath, filetype, description, uploader_id)
        VALUES (v_filename, v_filepath, 'image/jpeg', v_desc_string, v_variant_record.vendor_id)
        ON CONFLICT (filename) DO UPDATE SET updated_at = NOW()
        RETURNING media_id INTO v_media_id;

        -- Link media to the product variant
        INSERT INTO public.product_media_links (variant_id, media_id, is_display_image, is_thumbnail_image)
        VALUES (v_variant_record.variant_id, v_media_id, true, false)
        ON CONFLICT (variant_id, media_id) DO NOTHING;

    END LOOP;
END $$;

-- Orders Seed Data
insert into public.orders (customer_id, store_id, total_amount) values
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', (select store_id from stores where vendor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' limit 1), 1100.00),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where vendor_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' limit 1), 220.00),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', (select store_id from stores where vendor_id = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55' limit 1), 80.00),
('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' limit 1), 280.00),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', (select store_id from stores where vendor_id = 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88' limit 1), 270.00),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' limit 1), 60.00),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', (select store_id from stores where vendor_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' limit 1), 70.00),
('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', (select store_id from stores where vendor_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' limit 1), 20.00),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' limit 1), 1650.00),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' limit 1), 50.00);

insert into public.order_items (variant_id, order_id, quantity, price_at_purchase) values
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Laptop Pro X') LIMIT 1)), (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1) LIMIT 1), 1, 1100.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Classic Leather Jacket') LIMIT 1)), (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' LIMIT 1) LIMIT 1), 1, 220.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Organic Skincare Kit') LIMIT 1)), (select order_id from orders where customer_id = 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66' and store_id = (select store_id from stores where vendor_id = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55' LIMIT 1) LIMIT 1), 1, 80.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Curved Gaming Monitor') LIMIT 1)), (select order_id from orders where customer_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' and store_id = (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' LIMIT 1) LIMIT 1), 1, 280.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Evening Gown Elegant') LIMIT 1)), (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88' LIMIT 1) LIMIT 1), 1, 270.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Coffee Maker Drip') LIMIT 1)), (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' LIMIT 1) LIMIT 1), 1, 60.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Travel Backpack 40L') LIMIT 1)), (select order_id from orders where customer_id = 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66' and store_id = (select store_id from stores where vendor_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' LIMIT 1) LIMIT 1), 1, 70.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Hand-painted Ceramic Mug') LIMIT 1)), (select order_id from orders where customer_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' and store_id = (select store_id from stores where vendor_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' LIMIT 1) LIMIT 1), 1, 20.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'High-Performance Gaming Laptop') LIMIT 1)), (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' LIMIT 1) LIMIT 1), 1, 1650.00),
(((select variant_id from product_variants where product_id = (select product_id from products where title = 'Women''s Denim Jeans') LIMIT 1)), (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' LIMIT 1) LIMIT 1), 1, 50.00);

-- Product Reviews Seed Data
-- Fake data for product_reviews
insert into public.product_reviews (order_item_id, rating, customer_id, customer_remark) values
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Laptop Pro X') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1) LIMIT 1) LIMIT 1)), 4.50, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Great laptop, very fast!'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Classic Leather Jacket') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' LIMIT 1) LIMIT 1) LIMIT 1)), 5.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'High quality leather, perfect fit.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Organic Skincare Kit') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66' and store_id = (select store_id from stores where vendor_id = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55' LIMIT 1) LIMIT 1) LIMIT 1)), 4.00, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Good product, but a bit pricey.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Curved Gaming Monitor') LIMIT 1) and order_id = (select order_id from orders where customer_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' and store_id = (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' LIMIT 1) LIMIT 1) LIMIT 1)), 4.80, '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Amazing display for gaming!'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Evening Gown Elegant') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a88' LIMIT 1) LIMIT 1) LIMIT 1)), 5.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Absolutely stunning dress, exceeded expectations.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Coffee Maker Drip') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' limit 1) LIMIT 1) LIMIT 1)), 3.50, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Works well, but a bit slow.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Travel Backpack 40L') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66' and store_id = (select store_id from stores where vendor_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' LIMIT 1) LIMIT 1) LIMIT 1)), 4.20, 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Spacious and comfortable for travel.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Hand-painted Ceramic Mug') LIMIT 1) and order_id = (select order_id from orders where customer_id = '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99' and store_id = (select store_id from stores where vendor_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' LIMIT 1) LIMIT 1) LIMIT 1)), 4.90, '14eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Beautiful craftsmanship, love it!'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'High-Performance Gaming Laptop') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' and store_id = (select store_id from stores where vendor_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a77' LIMIT 1) LIMIT 1) LIMIT 1)), 4.70, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Super powerful, runs all games smoothly.'),
(((select order_item_id from order_items where variant_id = (select variant_id from product_variants where product_id = (select product_id from products where title = 'Women''s Denim Jeans') LIMIT 1) and order_id = (select order_id from orders where customer_id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44' and store_id = (select store_id from stores where vendor_id = '45eebc99-9c0b-4ef8-bb6d-6bb9bd380b00' LIMIT 1) LIMIT 1) LIMIT 1)), 4.00, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Comfortable and stylish, good value.');

-- Update Media Descriptions
WITH media_descriptions AS (
    SELECT
        m.media_id,
        array_to_string(p.description, ' ') || COALESCE(' - ' || string_agg(po.option_name || ': ' || pov.value, ', '), '') AS new_description
    FROM
        media m
    JOIN
        product_media_links pml ON m.media_id = pml.media_id
    JOIN
        product_variants pv ON pml.variant_id = pv.variant_id
    JOIN
        products p ON pv.product_id = p.product_id
    LEFT JOIN
        variant_to_option_values vtov ON pv.variant_id = vtov.variant_id
    LEFT JOIN
        product_option_values pov ON vtov.variant_value_id = pov.option_value_id
    LEFT JOIN
        product_options po ON pov.option_id = po.option_id
    GROUP BY
        m.media_id, p.description
)
UPDATE
    media
SET
    description = media_descriptions.new_description
FROM
    media_descriptions
WHERE
    media.media_id = media_descriptions.media_id;

-- Missing Default Variants
-- 1. Create a default variant and set its initial inventory for any product that doesn't have one.
DO $$
DECLARE
    p_record RECORD;
    v_new_variant_id INT;
BEGIN
    FOR p_record IN
        SELECT p.product_id, p.title FROM public.products p
        LEFT JOIN public.product_variants pv ON p.product_id = pv.product_id
        WHERE pv.variant_id IS NULL
    LOOP
        -- Insert the new variant without the quantity
        INSERT INTO public.product_variants (product_id, sku, base_price)
        VALUES (
            p_record.product_id,
            regexp_replace(p_record.title, '[^a-zA-Z0-9_]+', '', 'g') || 'STD',
            100000
        )
        ON CONFLICT (sku) DO NOTHING
        RETURNING variant_id INTO v_new_variant_id;

        -- If a new variant was actually inserted (i.e., no conflict), set its initial inventory.
        IF v_new_variant_id IS NOT NULL THEN
            INSERT INTO public.inventory (variant_id, quantity_change, reason)
            VALUES (v_new_variant_id, 1, 'initial_stock');
        END IF;
    END LOOP;
END $$;

-- 2. Generate and link media for any variants that are missing it.
DO $$
DECLARE
    v_variant_record RECORD;
    v_media_id INT;
    v_filename TEXT;
    v_filepath TEXT;
    v_options_string TEXT;
    v_desc_string TEXT;
    v_dam_folder_prefix TEXT;
BEGIN
    -- Get the DAM folder prefix from the app_config table
    SELECT config_value INTO v_dam_folder_prefix FROM public.app_config WHERE config_key = 'dam_folder_prefix';

    FOR v_variant_record IN
        SELECT
            pv.variant_id,
            p.title,
            p.vendor_id,
            (
                SELECT STRING_AGG(pov.value, '_' ORDER BY po.option_name)
                FROM public.variant_to_option_values vtov
                JOIN public.product_option_values pov ON vtov.variant_value_id = pov.option_value_id
                JOIN public.product_options po ON pov.option_id = po.option_id
                WHERE vtov.variant_id = pv.variant_id
            ) as options
        FROM
            public.product_variants pv
        JOIN
            public.products p ON pv.product_id = p.product_id
        WHERE NOT EXISTS (
            SELECT 1 FROM public.product_media_links pml WHERE pml.variant_id = pv.variant_id
        )
    LOOP
        -- Sanitize title and options for filename
        v_filename := regexp_replace(v_variant_record.title, '[^a-zA-Z0-9_]+', '_', 'g');

        v_options_string := '';
        IF v_variant_record.options IS NOT NULL THEN
            v_options_string := '_' || regexp_replace(v_variant_record.options, '[^a-zA-Z0-9_]+', '_', 'g');
        END IF;

        v_desc_string := v_variant_record.title || ' ' || COALESCE(regexp_replace(v_variant_record.options, '_', ' ', 'g'), '');

        v_filename := v_filename || v_options_string || '.jpg';
        v_filepath := v_dam_folder_prefix || 'products/' || v_filename;

        -- Insert into media table
        INSERT INTO public.media (filename, filepath, filetype, description, uploader_id)
        VALUES (v_filename, v_filepath, 'image/jpeg', v_desc_string, v_variant_record.vendor_id)
        ON CONFLICT (filename) DO UPDATE SET updated_at = NOW()
        RETURNING media_id INTO v_media_id;

        -- Link media to the product variant
        INSERT INTO public.product_media_links (variant_id, media_id, is_display_image, is_thumbnail_image)
        VALUES (v_variant_record.variant_id, v_media_id, true, false)
        ON CONFLICT (variant_id, media_id) DO NOTHING;

    END LOOP;
END $$;

-- Vary product pricing so the UI/UX shows meaningfully different prices.
-- All variants are seeded with a flat base_price of 100000; this replaces that
-- with per-category base prices plus a per-product spread. base_price is stored
-- in kobo (the minor unit for NGN; NGN 1 = 100 kobo).
UPDATE product_variants pv
SET base_price = (
    SELECT
      CASE c.category_name
        WHEN 'Electronics' THEN 150000
        WHEN 'Clothing' THEN 25000
        WHEN 'Books' THEN 8000
        WHEN 'Beauty Products' THEN 12000
        WHEN 'Automobiles' THEN 1500000
        WHEN 'Video Games' THEN 45000
        WHEN 'Home & Kitchen' THEN 30000
        WHEN 'Toys & Games' THEN 9000
        WHEN 'Health & Household' THEN 10000
        WHEN 'Pet Supplies' THEN 15000
        WHEN 'Sports & Outdoors' THEN 20000
        WHEN 'Tools & Home Improvement' THEN 25000
        WHEN 'Arts, Crafts & Sewing' THEN 11000
        WHEN 'Baby' THEN 13000
        WHEN 'Garden & Outdoor' THEN 22000
        WHEN 'Musical Instruments' THEN 80000
        WHEN 'Office Products' THEN 40000
        WHEN 'Software' THEN 30000
        WHEN 'Collectibles & Fine Art' THEN 50000
        WHEN 'Industrial & Scientific' THEN 120000
        WHEN 'Handmade' THEN 35000
        ELSE 15000
      END
      * (100 + (p.product_id % 41)) / 100
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE p.product_id = pv.product_id
  );

-- Correct media filenames that the seed slugifies differently from the actual
-- Cloudinary uploads (the uploads drop apostrophes and keep hyphens), and fall
-- back to the product's base image for variant combinations that were never
-- uploaded. Without this, ProductImage shows the missing-image placeholder.
UPDATE public.media SET filepath = 'sellit-media/products/Childrens_Story_Book.jpg'
  WHERE filepath = 'sellit-media/products/Children_s_Story_Book.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/Antivirus_Software_1-Year.jpg'
  WHERE filepath = 'sellit-media/products/Antivirus_Software_1_Year.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/Sci-Fi_Paperback_Novel.jpg'
  WHERE filepath = 'sellit-media/products/Sci_Fi_Paperback_Novel.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/Mens_Polo_Shirt.jpg'
  WHERE filepath = 'sellit-media/products/Men_s_Polo_Shirt_NAVY_XL.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/Running_Shoes_Mens.jpg'
  WHERE filepath = 'sellit-media/products/Running_Shoes_Men_s_WHITE_9.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/Womens_Denim_Jeans.jpg'
  WHERE filepath = 'sellit-media/products/Women_s_Denim_Jeans_BLACK_28.jpg';
UPDATE public.media SET filepath = 'sellit-media/products/4K_Smart_TV_55.jpg'
  WHERE filepath = 'sellit-media/products/4K_Smart_TV_55__4K_UHD_55_.jpg';

-- ---------------------------------------------------------------------------
-- Pricing model (see docs/pricing-model.md)
--   base_price  = bulk anchor per product (set above)
--   modifiers   = attribute deltas per option value (below)
--   overrides   = time-bound promotions / clearance (below)
--   effective   = product_variant_effective_price view
-- ---------------------------------------------------------------------------

-- 1. Default modifier per option value, in kobo. Colours/scents carry no
--    delta; capacity/storage/RAM/size/etc. step the price up.
UPDATE public.product_option_values pov
SET default_price_modifier = CASE pov.value
  -- STORAGE
  WHEN '128GB' THEN 0
  WHEN '256GB' THEN 30000
  WHEN '512GB' THEN 60000
  WHEN '1TB' THEN 120000
  WHEN '512GB SSD' THEN 90000
  WHEN '1TB SSD' THEN 160000
  WHEN '2TB SSD' THEN 300000
  -- CAPACITY
  WHEN '500GB' THEN 0
  WHEN '2TB' THEN 200000
  WHEN '4 Quart' THEN 0
  WHEN '5.8 Quart' THEN 15000
  WHEN '7 Quart' THEN 30000
  WHEN '2-Person' THEN 0
  WHEN '4-Person' THEN 40000
  -- RAM
  WHEN '16GB' THEN 0
  WHEN '32GB' THEN 50000
  WHEN '64GB' THEN 120000
  -- RESOLUTION
  WHEN '720p' THEN 0
  WHEN '1080p' THEN 20000
  WHEN '4K UHD' THEN 80000
  WHEN '8K UHD' THEN 200000
  -- SIZE (apparel, shoes, inches, watches, TVs)
  WHEN 'S' THEN 0
  WHEN 'M' THEN 5000
  WHEN 'L' THEN 10000
  WHEN 'XL' THEN 15000
  WHEN '6' THEN 0
  WHEN '7' THEN 3000
  WHEN '8' THEN 6000
  WHEN '9' THEN 9000
  WHEN '10' THEN 12000
  WHEN '11' THEN 15000
  WHEN '12' THEN 18000
  WHEN '26' THEN 0
  WHEN '28' THEN 4000
  WHEN '30' THEN 8000
  WHEN '32' THEN 12000
  WHEN '24 inch' THEN 0
  WHEN '27 inch' THEN 10000
  WHEN '32 inch' THEN 20000
  WHEN '41mm' THEN 0
  WHEN '45mm' THEN 8000
  WHEN '55"' THEN 0
  WHEN '65"' THEN 50000
  WHEN '75"' THEN 120000
  -- COUNT
  WHEN '60 Softgels' THEN 0
  WHEN '120 Softgels' THEN 5000
  WHEN '240 Softgels' THEN 12000
  -- VOLUME
  WHEN '30ml' THEN 0
  WHEN '50ml' THEN 3000
  WHEN '100ml' THEN 6000
  WHEN '200ml' THEN 12000
  -- WEIGHT RANGE
  WHEN '5-25 lbs' THEN 0
  WHEN '5-50 lbs' THEN 8000
  WHEN '10-70 lbs' THEN 20000
  -- THICKNESS
  WHEN '4mm' THEN 0
  WHEN '6mm' THEN 2000
  WHEN '8mm' THEN 4000
  -- WI-FI SPEED
  WHEN 'AX1800' THEN 0
  WHEN 'AX3000' THEN 10000
  WHEN 'AX5400' THEN 25000
  -- MEGAPIXELS
  WHEN '20MP' THEN 0
  WHEN '24MP' THEN 10000
  WHEN '30MP' THEN 25000
  -- REFRESH RATE
  WHEN '144Hz' THEN 0
  WHEN '240Hz' THEN 30000
  ELSE 0
END;

-- 2. Apply each option value's default delta to the variant-option links, so
--    effective price = base_price + Σ modifiers. Individual links can later be
--    overridden without touching the bulk base_price.
UPDATE public.variant_to_option_values vtov
SET price_modifier = pov.default_price_modifier,
    modifier_type = 'absolute'
FROM public.product_option_values pov
WHERE vtov.variant_value_id = pov.option_value_id;

-- 3. "Single out" a special variant by giving it its own base_price, outside
--    the bulk default (e.g. a clearance unit).
UPDATE public.product_variants
SET base_price = (base_price * 85) / 100
WHERE variant_id = (SELECT max(variant_id) FROM public.product_variants);

-- 4. Time-bound overrides: a 7-day flash sale (25% off) on one variant of the
--    first three products. The view uses the newest active override and the
--    price snaps back when it expires.
INSERT INTO public.variant_price_overrides (variant_id, absolute_price, start_date, end_date)
SELECT pv.variant_id,
       greatest(0, (pv.base_price * 75) / 100)::bigint,
       now(),
       now() + interval '7 days'
FROM public.product_variants pv
WHERE pv.variant_id IN (
    SELECT min(variant_id)
    FROM public.product_variants
    GROUP BY product_id
    ORDER BY min(variant_id)
    LIMIT 3
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.variant_price_overrides vpo
    WHERE vpo.variant_id = pv.variant_id AND vpo.end_date > now()
  );

-- Seed Auth Users From Profiles
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seeding auth.users from existing public.profiles
-- This ensures that for every profile, there is a login capability.

DO $$
DECLARE
    r RECORD;
    default_password text := 'password123'; -- CHANGE THIS IF YOU WANT A DIFFERENT DEFAULT
    existing_auth_user_id uuid;
    existing_auth_user_email text;
BEGIN
    -- Iterate over profiles that have an email
    FOR r IN SELECT * FROM public.profiles WHERE email IS NOT NULL
    LOOP
        -- Check if a user with this ID already exists
        SELECT id, email INTO existing_auth_user_id, existing_auth_user_email FROM auth.users WHERE id = r.id;

        IF existing_auth_user_id IS NOT NULL THEN
            -- User with this ID already exists in auth.users
            IF existing_auth_user_email IS DISTINCT FROM r.email THEN
                RAISE WARNING 'Auth user ID % already exists, but with a different email (%). Skipping profile % with email % to avoid conflict.',
                              r.id, existing_auth_user_email, r.id, r.email;
            ELSE
                RAISE NOTICE 'Auth user already exists for % (ID: %)', r.email, r.id;
            END IF;
            CONTINUE; -- Skip to next profile
        END IF;

        -- Check if a user with this email already exists (but with a different ID, handled above)
        IF EXISTS (SELECT 1 FROM auth.users WHERE email = r.email) THEN -- Removed AND id IS DISTINCT FROM r.id as it's handled by first IF
            RAISE WARNING 'Auth user with email % already exists. Skipping profile % to avoid unique constraint violation.',
                          r.email, r.id;
            CONTINUE; -- Skip to next profile
        END IF;

        -- If neither ID nor email conflicts, proceed with insert
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            is_super_admin
        )
        VALUES (
            '00000000-0000-0000-0000-000000000000', -- Standard Supabase UUID
            r.id,
            'authenticated',
            'authenticated',
            r.email,
            crypt(default_password, gen_salt('bf')), -- Securely hash the password
            now(), -- Mark email as confirmed
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            jsonb_build_object(
                'first_name', r.first_name,
                'last_name', r.last_name,
                'phone', r.phone, -- Include phone in metadata
                'dob', r.dob,     -- Include DOB in metadata
                'country', r.country,
                'is_customer', r.is_customer,
                'is_vendor', r.is_vendor
            ),
            now(),
            now(),
            r.phone,
            now(), -- Mark phone as confirmed
            false
        );

        RAISE NOTICE 'Created auth user for % (ID: %)', r.email, r.id;
    END LOOP;
END $$;


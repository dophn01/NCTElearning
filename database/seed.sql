-- NC Telearning Database Seed Data
-- Initial data for Vietnamese Literature e-learning platform

-- Insert sample users (password hash for 'password123')
INSERT INTO users (id, email, password_hash, first_name, last_name, role, grade_level) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@nc-telearning.com', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ2rS5tU7vW0xY3zA', 'Nguyễn', 'Văn Admin', 'admin', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'teacher1@nc-telearning.com', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ2rS5tU7vW0xY3zA', 'Trần', 'Thị Giáo Viên', 'admin', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'student1@nc-telearning.com', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ2rS5tU7vW0xY3zA', 'Lê', 'Văn Học Sinh', 'user', '10'),
('550e8400-e29b-41d4-a716-446655440004', 'student2@nc-telearning.com', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ2rS5tU7vW0xY3zA', 'Phạm', 'Thị Học Sinh', 'user', '11'),
('550e8400-e29b-41d4-a716-446655440005', 'student3@nc-telearning.com', '$2b$10$rQZ8K9mN2pL3vX7wE5tYCO8fG1hI2jK4lM6nO9pQ2rS5tU7vW0xY3zA', 'Hoàng', 'Văn Học Sinh', 'user', '12');

-- Insert sample courses
INSERT INTO courses (id, title, description, grade_level, created_by, is_published) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Văn Học Lớp 10 - Tác Phẩm Cổ Điển', 'Khóa học về các tác phẩm văn học cổ điển Việt Nam cho học sinh lớp 10', '10', '550e8400-e29b-41d4-a716-446655440002', true),
('650e8400-e29b-41d4-a716-446655440002', 'Văn Học Lớp 11 - Thơ Ca Hiện Đại', 'Khóa học về thơ ca hiện đại Việt Nam cho học sinh lớp 11', '11', '550e8400-e29b-41d4-a716-446655440002', true),
('650e8400-e29b-41d4-a716-446655440003', 'Văn Học Lớp 12 - Văn Học Đương Đại', 'Khóa học về văn học đương đại Việt Nam cho học sinh lớp 12', '12', '550e8400-e29b-41d4-a716-446655440002', true);

-- Insert sample lessons
INSERT INTO lessons (id, course_id, title, description, order_index, duration_minutes, is_published) VALUES
-- Grade 10 lessons
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Giới thiệu về Văn học Cổ điển', 'Tổng quan về văn học cổ điển Việt Nam', 1, 45, true),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Truyện Kiều - Nguyễn Du', 'Phân tích tác phẩm Truyện Kiều của Nguyễn Du', 2, 60, true),
-- Grade 11 lessons
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'Thơ Mới Việt Nam', 'Tìm hiểu về phong trào Thơ Mới', 1, 50, true),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'Xuân Diệu và Thơ Tình', 'Phân tích thơ tình của Xuân Diệu', 2, 55, true),
-- Grade 12 lessons
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', 'Văn học Đương đại', 'Giới thiệu văn học Việt Nam đương đại', 1, 40, true),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440003', 'Nguyễn Ngọc Tư và Văn học Nam Bộ', 'Tìm hiểu về văn học Nam Bộ qua tác phẩm của Nguyễn Ngọc Tư', 2, 50, true);

-- Insert sample videos
INSERT INTO videos (id, lesson_id, title, description, video_url, duration_seconds) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Bài giảng Văn học Cổ điển', 'Video bài giảng về văn học cổ điển Việt Nam', 'https://example.com/video1.mp4', 2700),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'Phân tích Truyện Kiều', 'Video phân tích chi tiết tác phẩm Truyện Kiều', 'https://example.com/video2.mp4', 3600),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Thơ Mới Việt Nam', 'Video giới thiệu về phong trào Thơ Mới', 'https://example.com/video3.mp4', 3000),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440004', 'Xuân Diệu và Thơ Tình', 'Video phân tích thơ tình của Xuân Diệu', 'https://example.com/video4.mp4', 3300);

-- Insert sample quizzes
INSERT INTO quizzes (id, lesson_id, title, description, time_limit_minutes, max_attempts, is_published) VALUES
('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Kiểm tra Văn học Cổ điển', 'Bài kiểm tra về kiến thức văn học cổ điển', 30, 3, true),
('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'Kiểm tra Truyện Kiều', 'Bài kiểm tra về tác phẩm Truyện Kiều', 45, 2, true),
('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Kiểm tra Thơ Mới', 'Bài kiểm tra về phong trào Thơ Mới', 25, 3, true);

-- Insert sample quiz questions
INSERT INTO quiz_questions (id, quiz_id, question_text, question_type, order_index, points) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'Văn học cổ điển Việt Nam bắt đầu từ thời kỳ nào?', 'multiple_choice', 1, 2),
('a50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440001', 'Tác phẩm nào được coi là kiệt tác của văn học cổ điển Việt Nam?', 'multiple_choice', 2, 3),
('a50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440002', 'Nguyễn Du sinh năm nào?', 'multiple_choice', 1, 1),
('a50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440002', 'Truyện Kiều có bao nhiêu câu thơ?', 'multiple_choice', 2, 2);

-- Insert quiz question options
INSERT INTO quiz_question_options (id, question_id, option_text, is_correct, order_index) VALUES
-- Question 1 options
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'Thời Lý - Trần', false, 1),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', 'Thời Lê - Nguyễn', true, 2),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440001', 'Thời Nguyễn', false, 3),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440001', 'Thời Đinh - Lê', false, 4),
-- Question 2 options
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440002', 'Chinh phụ ngâm', false, 1),
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440002', 'Truyện Kiều', true, 2),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440002', 'Cung oán ngâm khúc', false, 3),
('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440002', 'Lục Vân Tiên', false, 4);

-- Insert sample essay exercises
INSERT INTO essay_exercises (id, lesson_id, title, prompt, word_count_min, word_count_max, time_limit_minutes, is_published) VALUES
('c50e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'Phân tích nhân vật Thúy Kiều', 'Hãy phân tích tính cách và số phận của nhân vật Thúy Kiều trong tác phẩm Truyện Kiều của Nguyễn Du. Bài viết cần có đầy đủ mở bài, thân bài và kết bài.', 300, 500, 60, true),
('c50e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004', 'Cảm nhận về thơ tình Xuân Diệu', 'Hãy trình bày cảm nhận của em về thơ tình của Xuân Diệu. Chọn một bài thơ cụ thể để phân tích.', 250, 400, 45, true),
('c50e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440006', 'Đặc điểm văn học Nam Bộ', 'Phân tích đặc điểm của văn học Nam Bộ qua tác phẩm của Nguyễn Ngọc Tư.', 350, 600, 75, true);

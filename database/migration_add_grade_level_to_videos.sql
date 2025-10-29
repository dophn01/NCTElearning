-- Migration: Add grade_level column to videos table
-- This migration adds the grade_level column to the videos table to support simplified grade-based categorization

-- Add the grade_level column to videos table
ALTER TABLE videos ADD COLUMN grade_level grade_level;

-- Update existing videos to have a default grade level based on their lesson's course
-- This is a temporary solution - in production, you might want to manually assign grade levels
UPDATE videos 
SET grade_level = (
    SELECT c.grade_level 
    FROM lessons l 
    JOIN courses c ON l.course_id = c.id 
    WHERE l.id = videos.lesson_id
)
WHERE lesson_id IS NOT NULL;

-- For videos without lessons, set a default grade level (you may want to adjust this)
UPDATE videos 
SET grade_level = '10' 
WHERE lesson_id IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE videos ALTER COLUMN grade_level SET NOT NULL;

-- Add an index for better performance when filtering by grade level
CREATE INDEX idx_videos_grade_level ON videos(grade_level);


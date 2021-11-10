import mongoose from 'mongoose'

/* lesson details schema for db and lesson-related feature implementation */
const LessonSchema = new mongoose.Schema({
    title: String,
    content: String,
    resource_url: String
})

const Lesson = mongoose.model('Lesson', LessonSchema)

/* course details schema for db and course-related feature implementation */
const CourseSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: 'Name is required'
    },
    image: {
      data: Buffer,
      contentType: String
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: 'Category is required'
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now
    },
    instructor: {type: mongoose.Schema.ObjectId, ref: 'User'},
    published: {
      type: Boolean,
      default: false
    },
    lessons: [LessonSchema]
})

export default mongoose.model('Course', CourseSchema)
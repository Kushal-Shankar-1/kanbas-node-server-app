import mongoose from 'mongoose';
import EnrollmentSchema from './schema.js';

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
export default Enrollment;

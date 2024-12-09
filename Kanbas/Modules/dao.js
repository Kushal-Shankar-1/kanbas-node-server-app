import Module from "./model.js"; // Import the Module model

/**
 * Retrieves modules for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Array} An array of modules for the specified course.
 */
export async function findModulesForCourse(courseId) {
  const modules = await Module.find({ course: courseId });
  return modules;
}

/**
 * Creates a new module and adds it to the database.
 * @param {Object} module - The module object to create.
 * @returns {Object} The newly created module with a unique ID.
 */
export async function createModule(module) {
  if (!module._id) {
    module._id = Date.now().toString();
  }
  const newModule = await Module.create(module);
  return newModule.toObject();
}

/**
 * Deletes a module by its ID.
 * @param {string} moduleId - The ID of the module to delete.
 * @returns {boolean} True if the module was found and deleted, false otherwise.
 */
export async function deleteModule(moduleId) {
  const moduleExists = await Module.findById(moduleId);
  if (!moduleExists) {
    return false; // Module not found
  }

  await Module.findByIdAndDelete(moduleId);
  return true;
}

/**
 * Updates a module in the database by its ID.
 * @param {string} moduleId - The ID of the module to update.
 * @param {Object} moduleUpdates - The updates to apply to the module.
 * @returns {Object|null} The updated module or null if not found.
 */
export async function updateModule(moduleId, moduleUpdates) {
  const updatedModule = await Module.findByIdAndUpdate(
    moduleId,
    moduleUpdates,
    { new: true }
  );
  return updatedModule;
}

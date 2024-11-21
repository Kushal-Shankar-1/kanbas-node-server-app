import Database from "../Database/index.js";

/**
 * Retrieves modules for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Array} An array of modules for the specified course.
 */
export function findModulesForCourse(courseId) {
  const { modules } = Database;
  return modules.filter((module) => module.course === courseId);
}

/**
 * Creates a new module and adds it to the database.
 * @param {Object} module - The module object to create.
 * @returns {Object} The newly created module with a unique ID.
 */
export function createModule(module) {
  const newModule = { ...module, _id: Date.now().toString() };
  Database.modules = [...Database.modules, newModule];
  return newModule;
}

/**
 * Deletes a module by its ID.
 * @param {string} moduleId - The ID of the module to delete.
 * @returns {boolean} True if the module was found and deleted, false otherwise.
 */
export function deleteModule(moduleId) {
  const { modules } = Database;
  const moduleExists = modules.some((module) => module._id === moduleId);

  if (!moduleExists) {
    return false; // Module not found
  }

  Database.modules = modules.filter((module) => module._id !== moduleId);
  return true;
}

/**
 * Updates a module in the database by its ID.
 * @param {string} moduleId - The ID of the module to update.
 * @param {Object} moduleUpdates - The updates to apply to the module.
 * @returns {Object|null} The updated module or null if not found.
 */
export function updateModule(moduleId, moduleUpdates) {
  const { modules } = Database;
  const module = modules.find((module) => module._id === moduleId);
  if (!module) return null;
  Object.assign(module, moduleUpdates); // Apply updates
  return module;
}

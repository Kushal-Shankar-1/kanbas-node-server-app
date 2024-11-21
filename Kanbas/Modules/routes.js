import * as modulesDao from "./dao.js";

/**
 * Sets up module-related routes.
 * @param {Express.Application} app - The Express application instance.
 */
export default function ModuleRoutes(app) {
  /**
   * DELETE /api/modules/:moduleId
   * Deletes a module by its ID.
   */
  app.delete("/api/modules/:moduleId", (req, res) => {
    const { moduleId } = req.params;

    const status = modulesDao.deleteModule(moduleId);
    if (!status) {
      return res.status(404).json({ error: "Module not found" });
    }

    res.sendStatus(204); // No Content
  });

  /**
   * Updates a module by its ID.
   */
  app.put("/api/modules/:moduleId", (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    const updatedModule = modulesDao.updateModule(moduleId, moduleUpdates);
    if (!updatedModule) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.status(204).send(); // No Content
  });
}

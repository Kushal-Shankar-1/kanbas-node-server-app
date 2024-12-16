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
  app.delete("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;

    try {
      const status = await modulesDao.deleteModule(moduleId);
      if (!status) {
        return res.status(404).json({ error: "Module not found" });
      }
      res.sendStatus(204); // No Content
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ error: "Failed to delete module" });
    }
  });

  /**
   * PUT /api/modules/:moduleId
   * Updates a module by its ID.
   */
  app.put("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;

    try {
      const updatedModule = await modulesDao.updateModule(
        moduleId,
        moduleUpdates
      );
      if (!updatedModule) {
        return res.status(404).json({ error: "Module not found" });
      }
      // Previously, this returned a 204 No Content.
      // If you want to confirm the update, respond with the updated module.
      // If you prefer the previous behavior, you can keep it.
      // Here, let's return the updatedModule object for clarity.
      res.status(200).json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(500).json({ error: "Failed to update module" });
    }
  });
}

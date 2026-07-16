import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const WORKING_DIR = "/workspace";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Sandbox Agent API",
    status: "success",
  });
});

/*
 * @route GET /list-files
 * @description List all files in the working directory
 */

app.get("/list-files", async (req, res) => {
  const listFiles = async (dir, baseDir) => {
    const entries = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });

    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);

        // Ignore common folders
        if (
          entry.isDirectory() &&
          (
            entry.name === "node_modules" ||
            entry.name === ".git" ||
            entry.name === "dist" ||
            entry.name === "build" ||
            entry.name === ".next" ||
            entry.name === ".vite" ||
            entry.name === ".cache"
          )
        ) {
          return [];
        }

        if (entry.isDirectory()) {
          return await listFiles(fullPath, baseDir);
        }

        return path.relative(baseDir, fullPath);
      })
    );

    return files.flat();
  };

  try {
    const files = await listFiles(WORKING_DIR, WORKING_DIR);

    res.status(200).json({
      message: "Files in working directory",
      files,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error listing files: ${error.message}`,
      status: "error",
    });
  }
});

/*
 * @route GET /read-file
 * @description Read the content of specified files
 */

app.get("/read-file", async (req, res) => {
  const { files } = req.query;

  if (!files) {
    return res.status(400).json({
      message: "No files provided",
      status: "error",
    });
  }

  const fileList = files.split(",");

  const result = await Promise.all(
    fileList.map(async (file) => {
      const filePath = path.join(WORKING_DIR, file);

      try {
        const content = await fs.promises.readFile(filePath, "utf-8");

        return {
          [filePath.replace(WORKING_DIR, "")]: content,
        };
      } catch (error) {
        return {
          [filePath.replace(WORKING_DIR, "")]: `Error reading file: ${error.message}`,
        };
      }
    })
  );

  res.status(200).json({
    message: "Files read successfully",
    files: result,
  });
});

/*
 * @route PATCH /update-files
 * @description Update the content of specified files
 */

app.patch("/update-files", async (req, res) => {
  const updates = req.body.updates;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({
      message:
        "Invalid request body. 'updates' should be an array of objects with 'file' and 'content' properties.",
      status: "error",
    });
  }

  const result = await Promise.all(
    updates.map(async (update) => {
      const { oldFile, file, content } = update;

      const filePath = path.join(WORKING_DIR, file);

      try {
        // Create destination folder if missing
        await fs.promises.mkdir(path.dirname(filePath), {
          recursive: true,
        });

        // -------------------------------
        // Rename support
        // -------------------------------
        if (oldFile && oldFile !== file) {
          const oldFilePath = path.join(WORKING_DIR, oldFile);

          try {
            await fs.promises.access(oldFilePath);

            // Create parent folder of new path
            await fs.promises.mkdir(path.dirname(filePath), {
              recursive: true,
            });

            await fs.promises.rename(oldFilePath, filePath);
          } catch (err) {
            // If old file doesn't exist, continue.
            // This allows creating a new file.
            if (err.code !== "ENOENT") {
              throw err;
            }
          }
        }

        // Write latest content
        await fs.promises.writeFile(filePath, content, "utf-8");

        return {
          [filePath.replace(WORKING_DIR, "")]:
            oldFile && oldFile !== file
              ? "Renamed and updated successfully"
              : "Updated successfully",
        };
      } catch (error) {
        return {
          [filePath.replace(WORKING_DIR, "")]:
            `Error updating file: ${error.message}`,
        };
      }
    })
  );

  res.status(200).json({
    message: "File update result",
    result,
  });
});



/*
 * @route POST /create-files
 * @description Create specified files
 */

app.post("/create-files", async (req, res) => {
  const files = req.body.files;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      message:
        "Invalid request body. 'files' should be an array of objects with 'file' and 'content' properties.",
      status: "error",
    });
  }

  const result = await Promise.all(
    files.map(async (fileObj) => {
      const { file, content } = fileObj;
      const filePath = path.join(WORKING_DIR, file);

      try {
        // Create folder automatically if missing
        await fs.promises.mkdir(path.dirname(filePath), {
          recursive: true,
        });

        await fs.promises.writeFile(filePath, content, "utf-8");

        return {
          [filePath.replace(WORKING_DIR, "")]: "Created successfully",
        };
      } catch (error) {
        return {
          [filePath.replace(WORKING_DIR, "")]: `Error creating file: ${error.message}`,
        };
      }
    })
  );

  res.status(200).json({
    message: "File create success result",
    result,
  });
});

export default app;
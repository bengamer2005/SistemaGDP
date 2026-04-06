import multer from "multer"

const storage = multer.memoryStorage()

export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]

        if(allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Formato de archivo no válido. Solo se permite .xlsx o .xls"))
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
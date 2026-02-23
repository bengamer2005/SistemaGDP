import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla DetectedFiles
export interface DetectedFilesAttributes {
    detected_fileId: number,
    file_name: string,
    file_path: string,
    processed: number,
    processed_at: Date,
    created_at: Date
}

// atributo que es opcional al momento de crear un nuevo DetectedFiles
export interface DetectedFilesCreationAttributes extends Optional<DetectedFilesAttributes, "detected_fileId" | "file_name" | "file_path" | "processed_at" | "processed"> {}

// modelo tipado de DetectedFiles
class DetectedFilesModel extends Model<DetectedFilesAttributes, DetectedFilesCreationAttributes> implements DetectedFilesAttributes {
    public detected_fileId!: number
    public file_name!: string
    public file_path!: string
    public processed!: number
    public processed_at!: Date
    public created_at!: Date
}

// inicializar el modelo con sus atributos y opciones
DetectedFilesModel.init({
    detected_fileId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    file_path: {
        type: DataTypes.STRING,
        allowNull: true
    },
    processed: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    processed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE
    }
}, {
    sequelize: DB,
    tableName: "Clients",
    timestamps: false
})

export default DetectedFilesModel
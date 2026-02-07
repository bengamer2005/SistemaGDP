import { DataTypes, Optional, Model } from "sequelize"
import DB from "../config/DBconfig"

// atributos que tiene la tabla DetectedFiles
export interface DetectedFilesAttributes {
    detectedFileId: number,
    fileName: string,
    filePath: string,
    processed: number,
    processedAt: Date,
    createdAt: Date
}

// atributo que es opcional al momento de crear un nuevo DetectedFiles
export interface DetectedFilesCreationAttributes extends Optional<DetectedFilesAttributes, "detectedFileId" | "fileName" | "filePath" | "processedAt" | "processed"> {}

// modelo tipado de DetectedFiles
class DetectedFilesModel extends Model<DetectedFilesAttributes, DetectedFilesCreationAttributes> implements DetectedFilesAttributes {
    public detectedFileId!: number
    public fileName!: string
    public filePath!: string
    public processed!: number
    public processedAt!: Date
    public createdAt!: Date
}

// inicializar el modelo con sus atributos y opciones
DetectedFilesModel.init({
    detectedFileId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    processed: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    processedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize: DB,
    tableName: "Clients",
    timestamps: false
})

export default DetectedFilesModel
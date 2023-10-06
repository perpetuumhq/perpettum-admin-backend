import Multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_FOLDER } from '../config/config';
import { STORAGE_SIZE_LIMIT } from '../constants/const';

const googleCloudStorageEngine: Multer.StorageEngine = {
    _handleFile: (req, file, cb) => {
        const fileName = `${uuidv4()}-${Date.now()}-${file.originalname.replace(/\s/g, '')}`;
        const storage = req.app.locals.storage;
        const bucket = storage.bucket();
        const writeStream = bucket.file(`${STORAGE_FOLDER.room}/${fileName}`).createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        file.stream.pipe(writeStream);

        writeStream.on('error', (err: any) => {
            cb(err);
        });

        writeStream.on('finish', () => {
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            cb(null, { path: fileUrl, filename: fileName });
        });
    },
    _removeFile: (req, file, cb) => {
        const storage = req.app.locals.storage;
        const bucket = storage.bucket();
        const fileName = file.filename;
        bucket
            .file(fileName)
            .delete()
            .then(() => {
                cb(null);
            })
            .catch((err: any) => {
                cb(err);
            });
    }
};

export const upload = Multer({
    storage: googleCloudStorageEngine,
    limits: {
        fileSize: STORAGE_SIZE_LIMIT.ROOM_SIZE
    }
});

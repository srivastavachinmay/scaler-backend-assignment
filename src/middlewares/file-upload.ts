import multer from 'multer';
import { randomBytes } from "crypto";

const MIME_TYPE_MAP: any = {
    'text/csv': 'csv',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'

};

export const singleFileUpload = (path: string, fileName: string) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb: any) => {
                cb(null, path);
            },
            filename: (req, file, cb) => {
                const ext: string = MIME_TYPE_MAP[file.mimetype];
                cb(null, randomBytes(6).toString('hex') + '.' + ext);
            }
        }),
        fileFilter: (req, file, cb) => {
            const isValid = !!MIME_TYPE_MAP[file.mimetype];
            let error: any = isValid ? null : new Error('Invalid mime type!');
            cb(error, isValid);
        }
    }).single(fileName)
};

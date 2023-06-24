import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Especifique o diretório de destino aqui
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = randomUUID(); // Gere um nome único para o arquivo
      const extension = file.originalname.split('.').pop(); // Obtenha a extensão do arquivo original
      cb(null, `${uniqueSuffix}.${extension}`); // Concatene o nome único com a extensão
    },
  }),
};

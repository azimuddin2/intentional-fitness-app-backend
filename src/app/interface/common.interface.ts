export interface UploadedFiles {
  image?: Express.Multer.File[];
  images?: Express.Multer.File[];
  logo?: Express.Multer.File[];
  profile?: Express.Multer.File[];
  banner?: Express.Multer.File[];
  frontSide?: Express.Multer.File[];
  backSide?: Express.Multer.File[];
  videos?: Express.Multer.File[];
  video?: Express.Multer.File[];
  documents?: Express.Multer.File[];
  document?: Express.Multer.File[];
}

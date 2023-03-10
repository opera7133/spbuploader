import "formidable"
declare module "formidable" {
  interface File {
    mimetype: string;
    filepath: string;
  }
}

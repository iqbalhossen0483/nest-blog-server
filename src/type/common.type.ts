export interface ResponseType<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    total: number;
    last_page: number;
  };
}

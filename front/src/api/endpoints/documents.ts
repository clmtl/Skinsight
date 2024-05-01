import axios from 'axios';
import { DocumentReadType } from 'src/types/document';

export function addDocument(data: FormData) {
  return axios.post('/documents', data).then((res) => res.data);
}

export function findAll(): Promise<DocumentReadType[]> {
  return axios.get('/documents').then((res) => res.data);
}

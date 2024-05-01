import axios from 'axios';
import { SkinImageReadType, SkinImagesResponseType } from 'src/types/skinImage';

export function findOne(id: string): Promise<SkinImageReadType> {
  return axios.get(`/skin-images/${id}`).then((res) => res.data);
}

export function findManyByUser(id: string): Promise<SkinImagesResponseType> {
  return axios.get(`/skin-images/user/${id}`).then((res) => res.data);
}

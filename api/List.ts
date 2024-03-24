import { AxiosResponse } from "axios";
import { axiosService } from "./AxiosService";

export async function QUESTIONS_LIST(): Promise<AxiosResponse | null> {
    try {
        const response: AxiosResponse = await axiosService.post(`/list`, {});
        return response.data;
    } catch (error) {
        return null;
    }
}
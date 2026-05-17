import api from "../axios/axios";
import { getCompanyId } from "../company/getDetails";

export const getScrapedData = async (page: number, limit: number) => {
  try {
    const res = await api.get(`/scrape-data?page=${page}&limit=${limit}`);
    console.log(res);
    return {
      rates: res.data.data,
      totalPages: res.data.meta.totalPages,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const triggerScraper = async (type: string) => {
  try {
    const companyId = await getCompanyId();

    const res = await api.post(`/company/${companyId}/scraper-config`, {
      type,
    });
    console.log(res);
    return {
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const editScraperConfig = async (config: {
  smbc: { intervalCronFormat: string; isMainSourceforUSDJPY: boolean };
  frankfurter: { intervalCronFormat: string; isMainSourceforUSDJPY: boolean };
}) => {
  try {
    const companyId = await getCompanyId();
    const res = await api.put(`/company/${companyId}/scraper-config`, config);
    console.log(res);
    return {
      message: res.data.message,
    };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error;
    throw new Error(message);
  }
};

export const getScraperConfig = async () => {
  try {
    const companyId = await getCompanyId();
    const res = await api.get(`/company/${companyId}/scraper-config`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error;
    throw new Error(message);
  }
};

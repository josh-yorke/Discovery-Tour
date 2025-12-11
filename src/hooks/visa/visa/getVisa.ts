import api from "../../axios/axios";

export const getVisa = async (id?: string) => {
  try {
    const res = await api.get(`/visas/${id}`);
    console.log(res);
    return res.data.data;
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaDocuments = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=document&visaId=${id}`);
    console.log(res.data.data);
    return {
      documents: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaFile = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/${id}?type=file`);
    console.log(res.data.data);
    return {
      file: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaProcesses = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=process&visaId=${id}`);
    console.log(res.data.data);
    return {
      processes: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaPricelists = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=price&visaId=${id}`);
    console.log(res.data.data);
    return {
      pricelists: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaTerms = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=terms&visaId=${id}`);
    console.log(res.data.data);
    return {
      terms: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

export const getVisaPayments = async (id: string) => {
  try {
    const res = await api.get(`/visa-dependents/?type=payment&visaId=${id}`);
    console.log(res.data.data);
    return {
      payments: res.data.data,
    };
  } catch (error: any) {
    const message = error.response.data.message || error;
    throw new Error(message);
  }
};

import axios, { CreateAxiosDefaults } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosConfig: CreateAxiosDefaults = {
	baseURL,
};

export const request = axios.create({ ...axiosConfig });

request.defaults.headers['Authorization'] = '';
request.defaults.headers['x-refresh'] = '';

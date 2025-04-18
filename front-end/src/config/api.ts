const apiConfig = {
  service: {
    main: import.meta.env.VITE_API_URL || "http://localhost:8000",
  },
  commonConfig: {
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  },
  debug: import.meta.env.DEV || false,
};

export default apiConfig;

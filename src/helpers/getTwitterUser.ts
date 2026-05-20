const getTwitterUser = (url: any) => {
  return `@${url!.match(/twitter\.com\/([^/]+)/i)[1]}`;
};

export default getTwitterUser;

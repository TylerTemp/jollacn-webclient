export default (offset, limit, total) => {
  const totalRem = total % limit; // 不能凑整的数
  const totalQuo = Math.trunc((total - totalRem) / limit);
  // console.log(`total=${total}/offset=${offset}/limit=${limit}/rem=${totalRem}; quo=${totalQuo}`);
  const totalPage = totalRem === 0
    ? totalQuo
    : totalQuo + 1;

  if (totalPage <= 1) {
    return { totalPage: 0, currentPage: 0 };
  }

  const currentPage = Math.trunc(offset / limit) + 1;
  return { totalPage, currentPage };
};

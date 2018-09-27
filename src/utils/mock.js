export const mock = (options, response) => {
  const { url } = options;
  let mockData;
  //机动车抢车道前五名
  if (false && url.indexOf('top/five') !== -1) {
    mockData = {
      data: [
        {
            id:1,
            name: '西湖路',
            count:320
        },
        {
            id:2,
            name: '胜利东路',
            count:304
        },
        {
            id:3,
            name: '工农路',
            count:264
        },
        {
            id:4,
            name: '解放东路',
            count:233
        },
        {
            id:5,
            name: '丹霞路',
            count:216
        }
      ],
      errCode: 0,
      maxPage: 0,
      total: 5
    };
    return {
      data: mockData
    };
  } else {
    return response;
  }
};

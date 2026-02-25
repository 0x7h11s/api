const config = [
  {
    name: "iptv_api",
    url: "https://raw.githubusercontent.com/alantang1977/iptv_api/refs/heads/main/output/live_ipv4.txt",
    list: ["雪球频道,", "📠┃央视频道,", "🐻┃卫视频道,"],
    rule: [],
  },
  {
    name: "TVBox_live",
    url: "https://raw.githubusercontent.com/Supprise0901/TVBox_live/main/live.txt",
    rule: [
      {
        index: 1,
        address: {
          genre: "🇨🇳IPV4线路,",
          index: 1,
        },
      },
      //  {
      //   index: 5,
      //   address: {
      //     genre: "🇨🇳IPV4线路,",
      //     index: 43,
      //   },
      // },
      // {
      //   index: 7,
      //   address: {
      //     genre: "🇨🇳IPV4线路,",
      //     index: 44,
      //   },
      // },
      // {
      //   index: 10,
      //   address: {
      //     genre: "🇨🇳IPV4线路,",
      //     index: 39,
      //   },
      // },
      // {
      //   index: 13,
      //   address: {
      //     genre: "🇨🇳IPV4线路,",
      //     index: 63,
      //   },
      // },
      // {
      //   index: 15,
      //   address: {
      //     genre: "🇨🇳IPV4线路,",
      //     index: 67,
      //   },
      // },
    ],
    list: ["雪球频道,", "🇨🇳组播线路,", "🇨🇳IPV4线路,"],
    activate: true,
  },
];

module.exports = config;
